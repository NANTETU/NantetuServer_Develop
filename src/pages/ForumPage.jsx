import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

export const ForumPage = ({ L, user, db, appId }) => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [name, setName] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Fetch posts from Firestore (Real)
    useEffect(() => {
        if (!user || !db || !appId) return; // Wait for User Auth!

        // Use root path 'forum_posts' as per original success, but with strict auth check
        const forumPath = 'forum_posts';

        const q = query(
            collection(db, forumPath),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(loadedPosts);
        }, (error) => {
            console.error("Forum Error:", error);
        });

        return () => unsubscribe();
    }, [user, db, appId]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;
        setIsSending(true);

        try {
            const forumPath = 'forum_posts';
            await addDoc(collection(db, forumPath), {
                text: newPost,
                name: name.trim() || L.forum.anonymous,
                uid: user.uid,
                createdAt: serverTimestamp()
            });
            setNewPost('');
        } catch (error) {
            console.error("Error posting:", error);
            alert("投稿に失敗しました。(権限エラー)");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16"><h2 className="text-4xl font-black mb-4 dark:text-white">{L.forum.title}</h2></div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <form onSubmit={handlePost}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={L.forum.input_name} className="w-full md:w-1/3 px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" />
                        </div>
                        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={L.forum.input_message} rows="3" className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none focus:ring-2 focus:ring-purple-500 transition-all text-lg" />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-400">※不適切な投稿は削除される場合があります。</p>
                            <button type="submit" disabled={isSending || !newPost.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5">
                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}{isSending ? L.forum.sending : L.forum.send}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="space-y-6">
                {posts.length === 0 ? <div className="text-center py-20 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-dashed border-2 border-gray-200 dark:border-gray-700"><MessageSquare size={48} className="mx-auto mb-4 opacity-20" /><p>{L.forum.no_posts}</p></div> : posts.map(post => (<div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up hover:shadow-md transition-all"><div className="flex justify-between items-start mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs">{post.name.charAt(0)}</div><span className="font-bold text-purple-900 dark:text-purple-300">{post.name}</span></div><span className="text-xs text-gray-400 font-mono">{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Just now'}</span></div><p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-10 text-lg leading-relaxed">{post.text}</p></div>))}
            </div>
        </div>
    );
};
