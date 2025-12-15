import React, { useState, useEffect } from 'react';
import {
    User, MapPin, Link2, Calendar, Clock, UserCheck, UserPlus, UserX,
    MessageSquare, MoreHorizontal, Edit3, Send, AlertCircle, CheckCircle
} from 'lucide-react';
import {
    doc, getDoc, updateDoc, setDoc, deleteDoc, collection, query, where,
    orderBy, limit, onSnapshot, addDoc, serverTimestamp, increment
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const formatTimestamp = (ts) => {
    if (!ts) return '';
    try {
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        if (Number.isNaN(d.getTime())) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
        return '';
    }
};

export const ProfilePage = ({ L, user, profile, db, page, navigate }) => {
    const [targetProfile, setTargetProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [newPostText, setNewPostText] = useState('');
    const [replyToPostId, setReplyToPostId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                if (!db) {
                    setError('プロファイルを読み込めません (DB 未初期化)');
                    return;
                }

                if (!user) {
                    setError(L?.profile?.need_login || 'プロフィールを見るにはログインしてください');
                    return;
                }

                let targetUid = user.uid;
                // Fix: Correctly parse UID from URL "user/UID"
                if (page && typeof page === 'string' && page.startsWith('user/')) {
                    const parts = page.split('/');
                    if (parts[1]) targetUid = parts[1];
                }

                if (targetUid === user.uid && profile) {
                    setTargetProfile(profile);
                    // Also fetch fresh followers count if needed, but for now rely on profile data
                } else {
                    const ref = doc(db, 'profiles', targetUid);
                    const snap = await getDoc(ref);
                    if (!snap.exists()) {
                        setError(L?.profile?.not_found || 'プロフィールが見つかりません');
                        return;
                    }
                    setTargetProfile(snap.data());
                }

                // フォロー状態を確認
                if (user.uid !== targetUid) {
                    const followRef = doc(db, 'follows', `${user.uid}_${targetUid}`);
                    const followSnap = await getDoc(followRef);
                    setIsFollowing(followSnap.exists());
                } else {
                    setIsFollowing(false);
                }

                // Counts would ideally come from a subcollection or counter, but here we use profile data fields
                // if available, or Defaults. We update state with loaded profile counts.
                // Note: The original code logic for counts was a bit implicit, we'll ensure they are set.
            } catch (error) {
                console.error("Error loading profile:", error);
                setError(L?.profile?.load_error || 'プロフィールの読み込み中にエラーが発生しました');
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        setError(null);
        setTargetProfile(null);
        load();
    }, [db, user, profile, page, L]);

    // Update counts when targetProfile changes
    useEffect(() => {
        if (targetProfile) {
            setFollowersCount(targetProfile.followerCount || 0);
            setFollowingCount(targetProfile.followingCount || 0);
        }
    }, [targetProfile]);

    // ユーザー投稿タイムライン
    useEffect(() => {
        if (!db || !user) {
            setPosts([]);
            setPostsLoading(false);
            return;
        }

        let targetUid = user.uid;
        if (page && typeof page === 'string' && page.startsWith('user/')) {
            const parts = page.split('/');
            if (parts[1]) targetUid = parts[1];
        }

        try {
            const q = query(
                collection(db, 'user_posts'),
                where('authorUid', '==', targetUid),
                orderBy('createdAt', 'desc'),
                limit(20)
            );

            const unsub = onSnapshot(q, (snap) => {
                const loaded = snap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                    // 日付を変換
                    createdAt: d.data().createdAt?.toDate ? d.data().createdAt : new Date(d.data().createdAt?.seconds * 1000)
                }));
                setPosts(loaded);
                setPostsLoading(false);
            }, (e) => {
                console.error('user_posts fetch error', e);
                setPosts([]);
                setPostsLoading(false);
            });

            return () => unsub();
        } catch (e) {
            console.error('user_posts subscribe error', e);
            setPosts([]);
            setPostsLoading(false);
        }
    }, [db, user, page]);

    const isOwnProfile = user && targetProfile &&
        (page && typeof page === 'string' && page.startsWith('user/')
            ? page.split('/')[1] === user.uid
            : true // plain 'user' page is own profile
        );

    const handleFollow = async () => {
        if (!db || !user || user.isAnonymous || !targetProfile) return;

        try {
            const targetUid = (page && page.startsWith('user/')) ? page.split('/')[1] : user.uid;
            // Prevent following self
            if (targetUid === user.uid) return;

            const followRef = doc(db, 'follows', `${user.uid}_${targetUid}`);

            if (isFollowing) {
                // フォロー解除
                await deleteDoc(followRef);
                // カウントを更新
                await updateDoc(doc(db, 'profiles', targetUid), {
                    followerCount: increment(-1)
                });
                await updateDoc(doc(db, 'profiles', user.uid), {
                    followingCount: increment(-1)
                });
                setFollowersCount(prev => Math.max(0, prev - 1));
            } else {
                // フォロー
                await setDoc(followRef, {
                    followerId: user.uid,
                    followingId: targetUid,
                    createdAt: serverTimestamp()
                });
                // カウントを更新
                await updateDoc(doc(db, 'profiles', targetUid), {
                    followerCount: increment(1)
                });
                await updateDoc(doc(db, 'profiles', user.uid), {
                    followingCount: increment(1)
                });
                setFollowersCount(prev => prev + 1);
            }
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.error('Follow action failed', e);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!db || !user || user.isAnonymous) return;
        const text = newPostText.trim();
        if (!text) return;
        if (text.length > 200) return;

        try {
            await addDoc(collection(db, 'user_posts'), {
                authorUid: user.uid,
                authorName: profile?.name || user.displayName || 'Unknown',
                authorAvatar: profile?.iconUrl || user.photoURL || '',
                text,
                parentId: null,
                likes: 0,
                replies: 0,
                createdAt: serverTimestamp(),
            });
            setNewPostText('');
        } catch (e) {
            console.error('post submit failed', e);
        }
    };

    const handleReplyOpen = (postId) => {
        setReplyToPostId(postId);
        setReplyText('');
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!db || !user || user.isAnonymous || !replyToPostId) return;
        const text = replyText.trim();
        if (!text) return;
        if (text.length > 200) return;

        try {
            // 返信を追加
            await addDoc(collection(db, 'user_posts'), {
                authorUid: user.uid,
                authorName: profile?.name || user.displayName || 'Unknown',
                authorAvatar: profile?.iconUrl || user.photoURL || '',
                text,
                parentId: replyToPostId,
                likes: 0,
                createdAt: serverTimestamp(),
            });

            // 親投稿の返信数を更新
            await updateDoc(doc(db, 'user_posts', replyToPostId), {
                replies: increment(1)
            });

            setReplyText('');
            setReplyToPostId(null);
        } catch (e) {
            console.error('reply submit failed', e);
        }
    };

    const handleLikePost = async (postId, currentLikes) => {
        if (!db || !user || user.isAnonymous) return;

        try {
            const likeRef = doc(db, 'post_likes', `${user.uid}_${postId}`);
            const likeSnap = await getDoc(likeRef);

            if (likeSnap.exists()) {
                // いいねを解除
                await deleteDoc(likeRef);
                await updateDoc(doc(db, 'user_posts', postId), {
                    likes: increment(-1)
                });
            } else {
                // いいねを追加
                await setDoc(likeRef, {
                    userId: user.uid,
                    postId,
                    createdAt: serverTimestamp()
                });
                await updateDoc(doc(db, 'user_posts', postId), {
                    likes: increment(1)
                });

                // 通知を送信（自分以外の投稿の場合）
                const postRef = doc(db, 'user_posts', postId);
                const postSnap = await getDoc(postRef);
                const post = postSnap.data();

                if (post && post.authorUid !== user.uid) {
                    await addDoc(collection(db, 'notifications'), {
                        type: 'like',
                        fromUserId: user.uid,
                        fromUserName: profile?.name || user.displayName || 'Unknown',
                        toUserId: post.authorUid,
                        postId,
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }

            // 投稿一覧を更新 (Optimistic update or re-fetch will handle it, 
            // but for instant feedback we can stick to snapshot listener)

        } catch (e) {
            console.error('Like action failed', e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-16 px-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">エラーが発生しました</h3>
                    <p className="text-red-600 dark:text-red-300">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 text-red-700 dark:text-red-200 rounded-lg font-medium transition-colors"
                    >
                        再読み込み
                    </button>
                </div>
            </div>
        );
    }

    if (!targetProfile) {
        return (
            <div className="max-w-4xl mx-auto py-16 px-4">
                <div className="text-center">
                    <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">プロフィールが見つかりません</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">指定されたユーザーは存在しないか、削除された可能性があります</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                        ホームに戻る
                    </button>
                </div>
            </div>
        );
    }

    const rootPosts = posts.filter(p => !p.parentId);
    const repliesByParent = posts.reduce((map, p) => {
        if (!p.parentId) return map;
        if (!map[p.parentId]) map[p.parentId] = [];
        map[p.parentId].push(p);
        return map;
    }, {});

    const socialIcons = {
        twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
        youtube: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg',
        twitch: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitch.svg',
        github: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg',
        instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg',
        facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
    };

    return (
        <div className="max-w-4xl mx-auto pb-16 pt-24">
            {/* バナー画像 */}
            <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden rounded-b-3xl shadow-lg">
                {targetProfile.bannerUrl ? (
                    <img
                        src={targetProfile.bannerUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                )}

                {/* プロフィール画像 */}
                <div className="absolute -bottom-16 left-6 md:left-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden shadow-lg">
                        {targetProfile.iconUrl ? (
                            <img
                                src={targetProfile.iconUrl}
                                alt={targetProfile.name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(targetProfile.name || 'U')}&background=7c3aed&color=fff&size=128`;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-purple-500 to-indigo-600">
                                {(targetProfile.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="absolute bottom-6 right-6 flex space-x-3">
                    {isOwnProfile ? (
                        <>
                            <button
                                onClick={() => navigate('user-edit')}
                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full font-medium flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                <Edit3 size={16} />
                                <span>プロフィールを編集</span>
                            </button>
                            <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <MoreHorizontal />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleFollow}
                                className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 transition-colors ${isFollowing
                                        ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
                                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                                    }`}
                            >
                                {isFollowing ? (
                                    <>
                                        <UserCheck size={16} />
                                        <span>フォロー中</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} />
                                        <span>フォローする</span>
                                    </>
                                )}
                            </button>
                            <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <MessageSquare size={16} />
                            </button>
                            <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <MoreHorizontal />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* プロフィール情報 */}
            <div className="px-6 md:px-8 pt-20 pb-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-black dark:text-white">{targetProfile.name || 'No Name'}</h1>
                    {targetProfile.gamerTag && (
                        <p className="text-gray-500 dark:text-gray-400">@{targetProfile.gamerTag}</p>
                    )}
                </div>

                {/* 自己紹介（Markdown対応） */}
                {targetProfile.bio && (
                    <div className="mb-4 text-gray-700 dark:text-gray-200 prose dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                a: ({ node, ...props }) => (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 dark:text-purple-400 hover:underline"
                                    />
                                ),
                                code: ({ node, inline, ...props }) => (
                                    <code
                                        {...props}
                                        className={`${inline
                                                ? 'bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm'
                                                : 'block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-2 overflow-x-auto text-sm'
                                            } font-mono`}
                                    />
                                ),
                            }}
                        >
                            {targetProfile.bio}
                        </ReactMarkdown>
                    </div>
                )}

                {/* 基本情報 */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {targetProfile.location && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5" />
                            <span>{targetProfile.location}</span>
                        </div>
                    )}
                    {targetProfile.links && (
                        <div className="flex items-center">
                            <Link2 className="w-4 h-4 mr-1.5" />
                            <a
                                href={targetProfile.links.startsWith('http') ? targetProfile.links : `https://${targetProfile.links}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 dark:text-purple-400 hover:underline"
                            >
                                {targetProfile.links.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                        </div>
                    )}
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>登録日: {formatTimestamp(targetProfile.createdAt)}</span>
                    </div>
                    {targetProfile.lastLoginAt && (
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            <span>最終ログイン: {formatTimestamp(targetProfile.lastLoginAt)}</span>
                        </div>
                    )}
                </div>

                {/* フォロー/フォロワー */}
                <div className="flex space-x-6 mb-6">
                    <button
                        className="hover:underline"
                    // onClick={() => navigate(`/user/${page?.split('/')[1]}/following`)}
                    >
                        <span className="font-bold text-gray-900 dark:text-white">{followingCount}</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">フォロー中</span>
                    </button>
                    <button
                        className="hover:underline"
                    // onClick={() => navigate(`/user/${page?.split('/')[1]}/followers`)}
                    >
                        <span className="font-bold text-gray-900 dark:text-white">{followersCount}</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">フォロワー</span>
                    </button>
                </div>

                {/* ソーシャルリンク */}
                {targetProfile.socialLinks?.length > 0 && (
                    <div className="flex space-x-3 mb-6">
                        {targetProfile.socialLinks.map((link, index) => (
                            link.url && (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    title={link.platform}
                                >
                                    <img
                                        src={socialIcons[link.platform] || socialIcons.twitter}
                                        alt={link.platform}
                                        className="w-5 h-5"
                                    />
                                </a>
                            )
                        ))}
                    </div>
                )}
            </div>

            {/* タブナビゲーション */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                    <button className="flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm border-purple-500 text-purple-600 dark:text-purple-400">
                        投稿
                    </button>
                    <button className="flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
                        メディア
                    </button>
                    <button className="flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
                        いいね
                    </button>
                </nav>
            </div>

            {/* タイムライン */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-black mb-4 dark:text-white flex items-center gap-2">
                    <MessageSquare className="text-purple-500" size={20} /> ユーザー投稿
                </h3>

                {isOwnProfile && !user?.isAnonymous && (
                    <form onSubmit={handlePostSubmit} className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <textarea
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value.slice(0, 200))}
                            rows={3}
                            placeholder="いま何してる？ (最大200文字)"
                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white text-sm resize-none"
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{newPostText.length}/200</span>
                            <button
                                type="submit"
                                disabled={!newPostText.trim()}
                                className="px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center gap-1"
                            >
                                <Send size={14} /> 投稿
                            </button>
                        </div>
                    </form>
                )}

                {postsLoading ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">読み込み中...</div>
                ) : rootPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        まだ投稿がありません。
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rootPosts.map(post => (
                            <div key={post.id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-900/60">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{targetProfile.name || 'No Name'}</span>
                                    <span className="text-[11px] text-gray-400">
                                        {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : ''}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-2">{post.text}</p>
                                <button
                                    type="button"
                                    onClick={() => handleReplyOpen(post.id)}
                                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                    返信する
                                </button>

                                {/* 返信一覧 */}
                                {repliesByParent[post.id] && (
                                    <div className="mt-3 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-2">
                                        {repliesByParent[post.id].map(reply => (
                                            <div key={reply.id} className="text-xs text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/80 rounded-xl px-3 py-2">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className="font-bold">返信</span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {reply.createdAt?.toDate ? reply.createdAt.toDate().toLocaleString() : ''}
                                                    </span>
                                                </div>
                                                <p className="whitespace-pre-wrap">{reply.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 返信フォーム */}
                                {replyToPostId === post.id && !user?.isAnonymous && (
                                    <form onSubmit={handleReplySubmit} className="mt-3 pl-4">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value.slice(0, 200))}
                                            rows={2}
                                            placeholder="返信を入力 (最大200文字)"
                                            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white text-xs resize-none"
                                        />
                                        <div className="flex justify-end items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                            <span>{replyText.length}/200</span>
                                            <button
                                                type="button"
                                                onClick={() => { setReplyToPostId(null); setReplyText(''); }}
                                                className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                            >
                                                キャンセル
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!replyText.trim()}
                                                className="px-4 py-1 rounded-full bg-purple-600 text-white font-bold disabled:bg-gray-400 flex items-center gap-1"
                                            >
                                                <Send size={12} /> 返信
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
