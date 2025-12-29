import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar, ArrowRight, User, MessageSquare, Heart, Eye,
    FileText
} from 'lucide-react';
import {
    doc, getDoc, updateDoc, collection, query,
    orderBy, onSnapshot, addDoc, serverTimestamp, increment
} from 'firebase/firestore';

export const ArticlesPage = ({ L, db, navigate }) => {
    const [articles, setArticles] = useState([]);

    const extractFirstImage = (markdown) => {
        if (!markdown) return null;
        const imgRegex = /!\[.*?\]\((.*?)\)/;
        const match = markdown.match(imgRegex);
        return match ? match[1] : null;
    };

    useEffect(() => {
        let unsub = null;
        if (db) {
            try {
                const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
                unsub = onSnapshot(q, snap => {
                    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    setArticles(data);
                });
            } catch (e) { console.error('articles fetch error', e); }
        }
        return () => { if (unsub) unsub(); };
    }, [db]);

    return (
        <div className="max-w-6xl mx-auto py-24 px-4 animate-fade-in-scale">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black dark:text-white mb-2">{L.nav.articles}</h2>
                <p className="text-gray-600 dark:text-gray-400">最新の記事一覧を表示します。</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(a => {
                    const thumbnailUrl = extractFirstImage(a.md) || '/images/Image Not Found.png';
                    return (
                        <div key={a.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden group" onClick={() => navigate(`articles/${a.id}`)}>
                            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                <img
                                    src={thumbnailUrl}
                                    alt={a.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { e.target.src = '/images/Image Not Found.png'; }}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${a.type === 'maintenance' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                        {a.type}
                                    </span>
                                    <span className="text-xs text-gray-400">{a.date}</span>
                                </div>
                                <h3 className="font-bold text-base md:text-lg mb-2 dark:text-white line-clamp-2">
                                    {a.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Eye size={14} />
                                        <span>{a.viewCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Heart size={14} />
                                        <span>{a.likeCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {articles.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>記事がありません。</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ArticleDetail = ({ L, id, db, navigate }) => {
    const [article, setArticle] = useState(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [newCommentName, setNewCommentName] = useState('');
    const [newCommentText, setNewCommentText] = useState('');
    const [replyToId, setReplyToId] = useState(null);
    const [replyName, setReplyName] = useState('');
    const [replyText, setReplyText] = useState('');
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);

    const simpleRenderMarkdown = useCallback((text) => {
        if (!text) return '';
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        html = html.replace(/```([\s\S]*?)```/g, (_, code) =>
            `<pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto"><code>${code}</code></pre>`
        );
        html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>');
        html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$2</h2>'); // Fixed index from $1 to $2 if match? no $1 is correct
        // Correction: $1 is correct
        html = text // reset for cleaner replacement logic in a single pass if needed, but let's stick to the App.jsx version
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

        // Re-implementing exactly as in App.jsx
        html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto"><code>${code}</code></pre>`);
        html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>');
        html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>');
        html = html.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6">$2</li>');
        html = html.replace(/^[-*+] (.*$)/gm, '<li class="ml-6">$1</li>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
            const safeSrc = src.startsWith('https://') ? src : '';
            return `<div class="my-4"><img src="${safeSrc}" alt="${alt}" class="max-w-full rounded-md" loading="lazy"></div>`;
        });
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 underline">$1</a>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }, []);

    useEffect(() => {
        if (!db || !id) return;
        const fetchArticle = async () => {
            try {
                const docRef = doc(db, 'articles', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const articleData = { id: docSnap.id, ...docSnap.data() };
                    setArticle(articleData);
                    setContent(simpleRenderMarkdown(articleData.md || ''));
                    const likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '[]');
                    setHasLiked(likedArticles.includes(id));
                    await updateDoc(docRef, { viewCount: increment(1) });
                }
            } catch (error) { console.error('Article load error', error); }
        };
        fetchArticle();
    }, [db, id, simpleRenderMarkdown]);

    useEffect(() => {
        if (!db || !id) return;
        const q = query(collection(db, 'article_comments'), where('articleId', '==', id), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [db, id]);

    const handleLike = async () => {
        if (!db || !id || !article) return;
        const docRef = doc(db, 'articles', id);
        const likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '[]');
        try {
            if (hasLiked) {
                await updateDoc(docRef, { likeCount: increment(-1) });
                const newList = likedArticles.filter(item => item !== id);
                localStorage.setItem('liked_articles', JSON.stringify(newList));
                setHasLiked(false);
                setArticle(prev => ({ ...prev, likeCount: (prev.likeCount || 1) - 1 }));
            } else {
                await updateDoc(docRef, { likeCount: increment(1) });
                likedArticles.push(id);
                localStorage.setItem('liked_articles', JSON.stringify(likedArticles));
                setHasLiked(true);
                setArticle(prev => ({ ...prev, likeCount: (prev.likeCount || 0) + 1 }));
            }
        } catch (error) { console.error('Like error', error); }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!db || !id || !newCommentText.trim()) return;
        setIsSendingComment(true);
        try {
            await addDoc(collection(db, 'article_comments'), {
                articleId: id,
                name: newCommentName.trim() || '名無しさん',
                text: newCommentText.trim(),
                createdAt: serverTimestamp(),
            });
            setNewCommentText('');
        } catch (error) { console.error('Comment error', error); } finally { setIsSendingComment(false); }
    };

    if (!article) return <div className="max-w-4xl mx-auto py-24 px-4 text-center">読み込み中...</div>;

    const rootComments = comments.filter(c => !c.parentId);

    return (
        <div className="max-w-4xl mx-auto py-24 px-4 animate-fade-in">
            <h1 className="text-4xl font-black mb-2 dark:text-white">{article.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${article.type === 'maintenance' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {article.type}
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Eye size={20} />
                        <span className="text-sm font-medium">{article.viewCount || 0}</span>
                    </div>
                    <button onClick={handleLike} className={`flex items-center gap-2 transition-all hover:scale-110 ${hasLiked ? 'text-pink-500' : 'text-gray-500'}`}>
                        <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
                        <span className="text-sm font-medium">{article.likeCount || 0}</span>
                    </button>
                </div>
            </div>
            <div className="prose dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />

            <section className="mt-8 mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={22} className="text-purple-500" />
                    <h2 className="text-2xl font-bold dark:text-white">コメント</h2>
                    <span className="text-sm text-gray-500">{rootComments.length} 件</span>
                </div>
                <form onSubmit={handleSubmitComment} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <input
                        type="text"
                        placeholder="名前 (任意)"
                        className="w-full mb-3 p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none"
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                    />
                    <textarea
                        placeholder="コメントを入力..."
                        className="w-full p-2 bg-transparent outline-none resize-none"
                        rows="3"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                        <button disabled={isSendingComment} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">
                            {isSendingComment ? '送信中...' : '投稿する'}
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {rootComments.map(c => (
                        <div key={c.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-600">
                                {c.name ? c.name[0] : '名'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold dark:text-white">{c.name}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
