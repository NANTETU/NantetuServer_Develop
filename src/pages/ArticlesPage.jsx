import React, { useState, useEffect } from 'react';
import {
    Calendar, ArrowRight, User, MessageCircle, Heart, Share2,
    ArrowLeftOnRectangleIcon, Send
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
    doc, getDoc, updateDoc, collection, query, where,
    orderBy, onSnapshot, addDoc, serverTimestamp, increment, deleteDoc, setDoc
} from 'firebase/firestore';

export const ArticleDetail = ({ articleId, onBack, L, user, profile, db, navigate, showToast }) => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!articleId || !db) return;
        setLoading(true);

        // 記事取得 (Real-time update)
        const unsubArticle = onSnapshot(doc(db, 'articles', articleId), (docSnap) => {
            if (docSnap.exists()) {
                setArticle({ id: docSnap.id, ...docSnap.data() });
                // Check if user liked this article
                if (user) {
                    // This would require a subcollection or separate check which might be async
                    // For simplicity in this structure, we'll skipping complex like-check initial state sync for now
                    // or implement it if 'likes' collection structure is known.
                    // Let's assume a 'article_likes' collection query similar to posts.
                    // Optimistically we leave it false until clicked or checked.
                }
            } else {
                setArticle(null); // Not found
            }
            setLoading(false);
        }, (err) => {
            console.error("Article load error", err);
            setLoading(false);
        });

        // コメント取得
        const q = query(
            collection(db, 'comments'),
            where('articleId', '==', articleId),
            orderBy('createdAt', 'desc')
        );
        const unsubComments = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // Check Like Status
        let unsubLike;
        if (user) {
            // Assuming a structure for article likes
            const likeRef = doc(db, 'article_likes', `${user.uid}_${articleId}`);
            unsubLike = onSnapshot(likeRef, (snap) => {
                setIsLiked(snap.exists());
            });
        }

        return () => {
            unsubArticle();
            unsubComments();
            if (unsubLike) unsubLike();
        };
    }, [articleId, db, user]);


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'comments'), {
                articleId,
                text: newComment,
                // Fix: Link to user correctly, fallback to basic user data if profile not loaded
                userId: user.uid,
                userName: profile?.name || user.displayName || 'Unknown User',
                userAvatar: profile?.iconUrl || user.photoURL || '',
                createdAt: serverTimestamp()
            });
            setNewComment('');
            showToast && showToast('コメントを投稿しました');
        } catch (error) {
            console.error("Comment submit error", error);
            showToast && showToast('投稿に失敗しました');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            showToast && showToast('いいねするにはログインが必要です');
            return;
        }
        try {
            const likeRef = doc(db, 'article_likes', `${user.uid}_${article.id}`);
            if (isLiked) {
                await deleteDoc(likeRef);
                await updateDoc(doc(db, 'articles', article.id), { likes: increment(-1) });
            } else {
                await setDoc(likeRef, {
                    userId: user.uid,
                    articleId: article.id,
                    createdAt: serverTimestamp()
                });
                await updateDoc(doc(db, 'articles', article.id), { likes: increment(1) });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="py-32 text-center">Loading Content...</div>;
    if (!article) return <div className="py-32 text-center">Article not found.</div>;

    return (
        <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-right">
            <button onClick={onBack} className="group mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-bold"><ArrowLeftOnRectangleIcon className="transform rotate-180 group-hover:-translate-x-1 transition-transform" size={20} /> {L.news.back_to_list}</button>
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
                        <div className="relative h-64 md:h-96 w-full overflow-hidden">
                            <img src={article.thumbnail || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop"} alt={article.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-3">{article.category || 'Article'}</span>
                                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">{article.title}</h1>
                                <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
                                    <span className="flex items-center gap-1"><Calendar size={16} /> {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Unknown Date'}</span>
                                    <span className="flex items-center gap-1"><User size={16} /> {article.authorName || 'Admin'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 md:p-12 prose dark:prose-invert prose-lg max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{article.content}</ReactMarkdown>
                        </div>
                        <div className="px-8 pb-8 flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <button onClick={handleLike} className={`p-3 rounded-full flex items-center gap-2 transition-all ${isLiked ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <Heart size={24} className={isLiked ? "fill-current" : ""} /> <span className="font-bold">{article.likes || 0}</span>
                            </button>
                            <button className="p-3 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-all">
                                <Share2 size={24} /> <span className="font-bold">Share</span>
                            </button>
                        </div>
                    </article>

                    {/* Comments Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-2 dark:text-white"><MessageCircle size={24} className="text-purple-500" /> Comments ({comments.length})</h3>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                                    {profile?.iconUrl || user.photoURL ? (
                                        <img src={profile?.iconUrl || user.photoURL} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{user.displayName ? user.displayName[0] : 'U'}</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        rows="3"
                                        className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white resize-none"
                                    ></textarea>
                                    <div className="flex justify-end mt-2">
                                        <button type="submit" disabled={submitting || !newComment.trim()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                                            {submitting ? 'Posting...' : <><Send size={18} /> Post Comment</>}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl text-center text-gray-500 dark:text-gray-400 mb-8">
                                Please <button className="text-purple-600 font-bold hover:underline">login</button> to post comments.
                            </div>
                        )}

                        <div className="space-y-6">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`user/${comment.userId}`)}
                                    >
                                        {comment.userAvatar ? (
                                            <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{comment.userName ? comment.userName[0] : '?'}</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span
                                                className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer"
                                                onClick={() => navigate(`user/${comment.userId}`)}
                                            >
                                                {comment.userName}
                                            </span>
                                            <span className="text-xs text-gray-500">{comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-r-xl rounded-bl-xl">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Related Articles</h4>
                        <div className="space-y-4">
                            {/* Placeholder for related articles */}
                            <p className="text-sm text-gray-500">No related articles yet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ArticlesPage = ({ L, articleId, navigate, db, user, profile, showToast }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, [db]);

    if (articleId) {
        return <ArticleDetail articleId={articleId} onBack={() => navigate('articles')} L={L} user={user} profile={profile} db={db} navigate={navigate} showToast={showToast} />;
    }

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase mb-4 inline-block">Community Blog</span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white">Articles</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Discover tutorials, stories, and updates from the community.</p>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(article => (
                        <div key={article.id} onClick={() => navigate(`articles/${article.id}`)} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img src={article.thumbnail || "https://images.unsplash.com/photo-1499750310159-52f8f1321f87?q=80&w=2000&auto=format&fit=crop"} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{article.category || 'General'}</div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-3">
                                    <Calendar size={14} /> {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">{article.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">{article.excerpt || 'No description.'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <User size={16} className="text-gray-400" /> {article.authorName || 'Admin'}
                                    </div>
                                    <span className="text-purple-600 dark:text-purple-400 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">Read <ArrowRight size={16} className="ml-1" /></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
