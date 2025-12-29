import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, Save, X, Plus, MessageSquare, FileText, Lock } from 'lucide-react';
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';

export default function AdminPage({ L, db, navigate }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [articles, setArticles] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState('articles');
    const [editingArticle, setEditingArticle] = useState(null);
    const [newArticle, setNewArticle] = useState({ title: '', type: 'info', md: '', date: '' });
    const [isCreating, setIsCreating] = useState(false);

    // Simple password check (in production, use proper authentication)
    const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('admin_auth', 'true');
        } else {
            alert('パスワードが正しくありません');
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !db) return;

        const fetchArticles = async () => {
            try {
                const articlesSnapshot = await getDocs(collection(db, 'articles'));
                const articlesData = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setArticles(articlesData);
            } catch (error) {
                console.error('記事の取得に失敗しました:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const commentsSnapshot = await getDocs(query(collection(db, 'article_comments'), orderBy('createdAt', 'desc')));
                const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setComments(commentsData);
            } catch (error) {
                console.error('コメントの取得に失敗しました:', error);
            }
        };

        fetchArticles();
        fetchComments();
    }, [isAuthenticated, db]);

    const handleDeleteArticle = async (id) => {
        if (!window.confirm('この記事を削除してもよろしいですか?')) return;
        try {
            await deleteDoc(doc(db, 'articles', id));
            setArticles(articles.filter(a => a.id !== id));
            alert('記事を削除しました');
        } catch (error) {
            console.error('削除に失敗しました:', error);
            alert('削除に失敗しました');
        }
    };

    const handleUpdateArticle = async (id, data) => {
        try {
            await updateDoc(doc(db, 'articles', id), data);
            setArticles(articles.map(a => a.id === id ? { ...a, ...data } : a));
            setEditingArticle(null);
            alert('記事を更新しました');
        } catch (error) {
            console.error('更新に失敗しました:', error);
            alert('更新に失敗しました');
        }
    };

    const handleCreateArticle = async () => {
        if (!newArticle.title || !newArticle.md) {
            alert('タイトルと内容を入力してください');
            return;
        }
        try {
            const docRef = await addDoc(collection(db, 'articles'), {
                ...newArticle,
                date: newArticle.date || new Date().toISOString().split('T')[0],
                createdAt: serverTimestamp(),
                viewCount: 0,
                likeCount: 0
            });
            setArticles([{ id: docRef.id, ...newArticle }, ...articles]);
            setNewArticle({ title: '', type: 'info', md: '', date: '' });
            setIsCreating(false);
            alert('記事を作成しました');
        } catch (error) {
            console.error('作成に失敗しました:', error);
            alert('作成に失敗しました');
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('このコメントを削除してもよろしいですか?')) return;
        try {
            await deleteDoc(doc(db, 'article_comments', id));
            setComments(comments.filter(c => c.id !== id));
            alert('コメントを削除しました');
        } catch (error) {
            console.error('削除に失敗しました:', error);
            alert('削除に失敗しました');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_auth');
        setPassword('');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
                <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                            <Lock size={32} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white text-center mb-2">管理者ログイン</h1>
                    <p className="text-gray-400 text-center mb-8">パスワードを入力してください</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワード"
                            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                        />
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
                        >
                            ログイン
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 py-24 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-white">管理者パネル</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
                    >
                        ログアウト
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'articles'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <FileText size={20} />
                        記事管理
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'comments'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <MessageSquare size={20} />
                        コメント管理
                    </button>
                </div>

                {/* Articles Tab */}
                {activeTab === 'articles' && (
                    <div>
                        <div className="mb-6">
                            <button
                                onClick={() => setIsCreating(!isCreating)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                            >
                                <Plus size={20} />
                                新規記事作成
                            </button>
                        </div>

                        {/* Create Article Form */}
                        {isCreating && (
                            <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-4">新規記事</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="タイトル"
                                        value={newArticle.title}
                                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <select
                                        value={newArticle.type}
                                        onChange={(e) => setNewArticle({ ...newArticle, type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="info">お知らせ</option>
                                        <option value="maintenance">メンテナンス</option>
                                        <option value="update">アップデート</option>
                                        <option value="event">イベント</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={newArticle.date}
                                        onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <textarea
                                        placeholder="内容 (Markdown形式)"
                                        value={newArticle.md}
                                        onChange={(e) => setNewArticle({ ...newArticle, md: e.target.value })}
                                        rows={10}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCreateArticle}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                                        >
                                            <Save size={20} />
                                            作成
                                        </button>
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
                                        >
                                            <X size={20} />
                                            キャンセル
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Articles List */}
                        <div className="space-y-4">
                            {articles.map(article => (
                                <div key={article.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                    {editingArticle === article.id ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                defaultValue={article.title}
                                                id={`title-${article.id}`}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            <textarea
                                                defaultValue={article.md}
                                                id={`md-${article.id}`}
                                                rows={10}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        const title = document.getElementById(`title-${article.id}`).value;
                                                        const md = document.getElementById(`md-${article.id}`).value;
                                                        handleUpdateArticle(article.id, { title, md });
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                                                >
                                                    <Save size={18} />
                                                    保存
                                                </button>
                                                <button
                                                    onClick={() => setEditingArticle(null)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
                                                >
                                                    <X size={18} />
                                                    キャンセル
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                                                    <p className="text-sm text-gray-400">{article.date} • {article.type}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingArticle(article.id)}
                                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteArticle(article.id)}
                                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm line-clamp-3">{article.md?.substring(0, 200)}...</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-purple-400">{comment.name || '名無しさん'}</span>
                                            <span className="text-xs text-gray-500">
                                                {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString() : ''}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-2">{comment.text}</p>
                                        <p className="text-xs text-gray-500">記事ID: {comment.articleId}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                コメントがありません
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
