import React, { useState, useEffect } from 'react';
import { Bell, MessageCircle, Terminal, BookOpen, HelpCircle, FileText, Lock, Search, ArrowRight, Loader2, Send, Shield, AlertTriangle, CheckCircle, Info, MapPin, User, ChevronDown, ChevronUp, Clock, Calendar, MessageSquare, Eye, Layers } from 'lucide-react';
// UIコンポーネントのインポートパスを修正
import { NewsItem, AccordionItem, CopyBox, PostCard, LinkButton } from '../components/UI';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { JoinSection } from './Home'; // HomeからJoinSectionを正しくインポート

// --- News Page ---
export const NewsPage = ({ L, newsData }) => {
    // ニュースデータのリアルタイムリスナー (Firestoreから取得するロジックをシミュレート)
    const [liveNews, setLiveNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // 実際のアプリケーションでは、App.jsxでdbとappIdを取得し、ここで使用します。
    // 現状は props (db, appId) を使用せず、デフォルトデータで表示します。
    useEffect(() => {
        // Firestoreからニュースを取得するロジックのプレースホルダー
        // const newsRef = collection(db, `artifacts/${appId}/public/data/news`);
        // const q = query(newsRef, orderBy('date', 'desc'), limit(20));
        // const unsubscribe = onSnapshot(q, (snapshot) => { ... });
        // return () => unsubscribe();

        // 開発環境ではデフォルトデータをロード
        setLiveNews(L.news.default_data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
    }, [L.news.default_data]);

    const displayData = liveNews.length > 0 ? liveNews : L.news.default_data;

    if (loading) return <div className="text-center py-32 dark:text-white"><Loader2 className="animate-spin mx-auto" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Bell className="text-purple-500" size={40} />{L.news.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
            </div>
            <div className="space-y-4">
                {displayData.map((item) => (
                    // NewsItem コンポーネントは展開可能なリストアイテムとして再利用
                    <NewsItem key={item.id} item={item} L={L} isList={true} />
                ))}
            </div>
        </div>
    );
};

// --- Guide Page ---
export const GuidePage = ({ L }) => (
    <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><BookOpen className="text-purple-500" size={40} />{L.guide.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
        </div>

        <div className="space-y-12">
            {L.guide.sections.map((section, index) => (
                <div key={index} id={section.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <h3 className="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                        <section.icon size={28} />
                        {section.title}
                    </h3>
                    <div className="space-y-4">
                        {section.content.map((item, qIdx) => (
                            <AccordionItem key={qIdx} title={item.q} content={item.a} isOpen={qIdx === 0} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Commands Page ---
export const CommandsPage = ({ L }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSections = L.commands.sections.map(section => ({
        ...section,
        commands: section.commands.filter(cmd =>
            cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.desc.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(section => section.commands.length > 0);

    return (
        <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Terminal className="text-purple-500" size={40} />{L.commands.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.commands.subtitle}</p>
            </div>

            <div className="mb-12 relative max-w-lg mx-auto">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={L.commands.search_placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                />
            </div>

            <div className="space-y-10">
                {filteredSections.map((section, index) => (
                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center gap-3 mb-6">
                            <section.icon size={24} className="text-purple-600 dark:text-purple-400" />
                            <h3 className="text-2xl font-black dark:text-white border-b-2 border-purple-500 pb-1">{section.category}</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {section.commands.map((cmd, cIdx) => (
                                <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 transition-all hover:shadow-md group">
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-gray-700">
                                            {cmd.cmd}
                                        </code>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{cmd.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {filteredSections.length === 0 && (
                    <div className="text-center text-xl text-gray-500 dark:text-gray-400 py-10">
                        該当するコマンドは見つかりませんでした。
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Forum Page ---
export const ForumPage = ({ L }) => {
    // 掲示板データのリアルタイムリスナー
    const [posts, setPosts] = useState(L.forum.default_posts);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // 開発時はfalse

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 実際のFirebaseロジックのプレースホルダー
    useEffect(() => {
        // const postsRef = collection(db, `artifacts/${appId}/public/data/forum_posts`);
        // const q = query(postsRef, orderBy('date', 'desc'), limit(50));
        // const unsubscribe = onSnapshot(q, (snapshot) => {
        //     setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        //     setLoading(false);
        // });
        // return () => unsubscribe();

        // 開発時はデフォルトデータをソート
        setPosts(L.forum.default_posts.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, [L.forum.default_posts]);

    return (
        <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><MessageCircle className="text-purple-500" size={40} />{L.forum.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.forum.subtitle}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={L.forum.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                    />
                </div>
                <LinkButton
                    href="#" // 投稿ページへのリンク
                    text={L.forum.post_button}
                    Icon={Send}
                    className="flex-shrink-0"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">{L.forum.latest_posts}</h3>

                {loading ? (
                    <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-purple-500" size={32} /></div>
                ) : filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                        {filteredPosts.map((post, index) => (
                            <PostCard key={post.id} post={post} L={L} style={{ animationDelay: `${index * 50}ms` }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        該当する投稿はありません。
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Privacy Page ---
export const PrivacyPage = ({ L }) => (
    <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Lock className="text-purple-500" size={40} />{L.privacy.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{L.privacy.subtitle}</p>
        </div>

        <div className="space-y-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Info size={20} />
                    収集する情報
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    当サーバーでは、サービス提供および改善のために以下の情報を自動的または任意で収集します。
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                    <li>MinecraftユーザーIDとゲーム内での行動ログ (接続/切断時間、チャットログ、ブロックの破壊/設置)</li>
                    <li>お問い合わせフォームからの情報 (お名前、メールアドレス、メッセージ内容)</li>
                    <li>ウェブサイトの利用状況に関する匿名化されたデータ (ページビュー、アクセス元IPアドレス*ただし、個人を特定しない範囲)</li>
                </ul>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-4 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    IPアドレスは、荒らし対策、不正行為の調査以外の目的では利用しません。
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <CheckCircle size={20} />
                    情報の利用目的
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    収集した情報は、主に以下の目的で利用されます。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <span className="block font-bold mb-1 dark:text-white">サービス提供</span>
                        <span className="text-sm text-gray-500">ゲームの進行状況管理のため</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <span className="block font-bold mb-1 dark:text-white">荒らし対策</span>
                        <span className="text-sm text-gray-500">不正行為の調査および処罰のため</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <span className="block font-bold mb-1 dark:text-white">サービス改善</span>
                        <span className="text-sm text-gray-500">サーバーのパフォーマンス分析のため</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Shield size={20} />
                    第三者への提供
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    法令に基づく場合を除き、収集した個人情報をユーザーの同意なく第三者に提供することはありません。ただし、サーバーの運営を妨害する悪質な行為があった場合、関連機関へ情報を提供する可能性があります。
                </p>
            </div>
        </div>
    </div>
);

// --- Join Page (Wrapper) ---
// Home.jsxからJoinSectionを再利用
export const JoinPage = ({ L, serverStatus, navigate, setToast }) => (
    <div className="min-h-screen pt-14 dark:bg-gray-950">
        <JoinSection L={L} serverStatus={serverStatus} navigate={navigate} setToast={setToast} />
        <div className="pb-24" />
    </div>
);