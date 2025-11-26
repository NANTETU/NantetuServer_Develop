import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Terminal, BookOpen, HelpCircle, FileText, Lock, Search, ArrowRight, Loader2, Send, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { NewsItem, AccordionItem, CopyBox } from '../components/UI';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../utils/firebase';
import { JoinSection } from './Home';

// --- News Page ---
export const NewsPage = ({ L, newsData }) => {
    const displayData = (newsData && newsData.length > 0) ? newsData : L.news.default_data;
    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Bell className="text-purple-500" size={40} />{L.news.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
            </div>
            <div className="space-y-4">
                {displayData.map((item) => (
                    <NewsItem key={item.id} item={item} L={L} />
                ))}
            </div>
        </div>
    );
};

// --- Forum Page ---
export const ForumPage = ({ L, user }) => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [name, setName] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'forum_posts'), orderBy('createdAt', 'desc'), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => console.error(error));
        return () => unsubscribe();
    }, [user]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;
        setIsSending(true);
        try {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'forum_posts'), {
                text: newPost, name: name.trim() || L.forum.anonymous, uid: user.uid, createdAt: serverTimestamp()
            });
            setNewPost('');
        } catch (error) { console.error(error); } finally { setIsSending(false); }
    };

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16"><h2 className="text-4xl font-black mb-4 dark:text-white">{L.forum.title}</h2></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-10">
                <form onSubmit={handlePost}>
                    <div className="flex flex-col gap-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={L.forum.input_name} className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white" />
                        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={L.forum.input_message} rows="3" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none" />
                        <div className="flex justify-end">
                            <button type="submit" disabled={isSending || !newPost.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2">
                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}{isSending ? L.forum.sending : L.forum.send}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="space-y-4">
                {posts.length === 0 ? <div className="text-center py-10 text-gray-500"><MessageSquare size={48} className="mx-auto mb-4 opacity-20" /><p>{L.forum.no_posts}</p></div> : posts.map(post => (<div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up"><div className="flex justify-between items-start mb-2"><span className="font-bold text-purple-600 dark:text-purple-400">{post.name}</span><span className="text-xs text-gray-400">{post.createdAt?.toDate().toLocaleString() || 'Just now'}</span></div><p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.text}</p></div>))}
            </div>
        </div>
    );
};

// --- Guide Page ---
export const GuidePage = ({ L, activeAccordion, setActiveAccordion }) => (
    <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white tracking-tight flex justify-center items-center gap-4"><BookOpen className="text-purple-500 hidden sm:block" size={48} />{L.guide.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
        </div>
        <div className="mb-24 relative">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">{L.guide.steps_title}</h3>
            <div className="space-y-12">
                {L.guide.steps.map((item, index) => (
                    <div key={item.step} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                        <div className="flex-1 w-full"><div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-purple-400 transition-colors relative group"><div className="absolute top-0 left-0 w-2 h-full bg-purple-500 rounded-l-3xl"></div><h4 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h4><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p></div></div>
                        <div className="relative flex-shrink-0"><div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-xl z-10 relative ring-4 ring-white dark:ring-gray-900">{item.step}</div></div>
                        <div className="flex-1 hidden md:block"></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10 dark:text-white flex items-center justify-center gap-3"><HelpCircle size={32} className="text-yellow-500" />{L.guide.faq_title}</h3>
            <div className="space-y-4">
                {L.guide.faq_data.map((faq, idx) => (<AccordionItem key={idx} title={faq.q} content={faq.a} isOpen={activeAccordion === `faq-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `faq-${idx}` ? null : `faq-${idx}`)} />))}
            </div>
        </div>
    </div>
);

// --- Commands Page ---
export const CommandsPage = ({ L }) => (
    <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6 text-purple-600 dark:text-purple-400"><Terminal size={40} /></div>
            <h2 className="text-4xl font-black mb-4 dark:text-white">{L.commands.title}</h2>
        </div>
        <div className="grid gap-16">
            {L.commands.sections.map((section, idx) => (
                <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center gap-4 mb-8"><h3 className={`text-2xl font-bold ${section.color}`}>{section.category}</h3></div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {section.commands.map((cmd, cIdx) => (
                            <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 transition-all hover:shadow-md group">
                                <div className="flex justify-between items-start gap-4 mb-3"><code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-gray-700">{cmd.cmd}</code></div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{cmd.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Terms Page (New) ---
export const TermsPage = ({ L }) => {
    // Use data from L if available, otherwise fallback to generic text
    // Lからのデータがあれば使用し、なければ汎用的なテキストを使用
    const title = L.terms?.title || "利用規約";
    const subtitle = L.terms?.subtitle || "当サーバーを利用する上でのルール";
    const sections = L.terms?.sections || [
        {
            title: "第1条（総則）",
            icon: <Info size={24} className="text-blue-500" />,
            content: "本規約は、Nantetu Server（以下「当サーバー」）が提供するサービスを利用するすべてのユーザーに適用されます。当サーバーに参加した時点で、本規約に同意したものとみなします。"
        },
        {
            title: "第2条（禁止事項）",
            icon: <AlertTriangle size={24} className="text-red-500" />,
            content: (
                <ul className="list-disc pl-5 space-y-2">
                    <li>他者への嫌がらせ、誹謗中傷、差別的発言</li>
                    <li>サーバーへの負荷を意図的に高める行為（DDoS攻撃など）</li>
                    <li>不正なクライアント（チートツール、MOD）の使用</li>
                    <li>荒らし行為、他者の建築物の破壊</li>
                    <li>スパム行為、過度な宣伝</li>
                    <li>運営スタッフの指示に従わない行為</li>
                </ul>
            )
        },
        {
            title: "第3条（免責事項）",
            icon: <Shield size={24} className="text-gray-500" />,
            content: "当サーバーの利用により生じた損害（データ消失、PCトラブル等）について、運営は一切の責任を負いません。また、予告なくサービスを停止・終了する場合があります。"
        },
        {
            title: "第4条（処罰）",
            icon: <CheckCircle size={24} className="text-green-500" />,
            content: "本規約に違反した場合、警告、一時的なBAN、または永久的なBAN等の措置を行います。処罰の内容についての異議申し立ては原則として受け付けません。"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <FileText className="text-purple-500" size={40} />
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {sections.map((section, index) => (
                        <div key={index} className="p-8 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                                    {section.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {section.title}
                                    </h3>
                                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        最終更新日: 2024年4月1日
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Privacy Page (New) ---
export const PrivacyPage = ({ L }) => {
    // Use data from L if available, otherwise fallback to generic text
    const title = L.privacy?.title || "プライバシーポリシー";
    const subtitle = L.privacy?.subtitle || "個人情報の取り扱いについて";

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <Lock className="text-purple-500" size={40} />
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                        <Search size={20} />
                        収集する情報
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        当サーバーでは、サービスの提供と向上のために以下の情報を自動的に収集する場合があります。
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                        <li>Minecraftのユーザー名およびUUID</li>
                        <li>IPアドレスおよび接続ログ</li>
                        <li>チャットログおよびコマンド実行履歴</li>
                        <li>フォーラムへの投稿内容</li>
                    </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                        <CheckCircle size={20} />
                        情報の利用目的
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        収集した情報は、以下の目的でのみ使用されます。
                    </p>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <span className="block font-bold mb-1 dark:text-white">荒らし対策</span>
                            <span className="text-sm text-gray-500">不正行為の調査および処罰のため</span>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
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
};

// --- Join Page (Wrapper) ---
export const JoinPage = ({ L, serverStatus, handleCopy, navigate }) => (
    <div className="pt-24"><JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} /></div>
);