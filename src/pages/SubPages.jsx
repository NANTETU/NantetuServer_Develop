import React, { useState, useEffect, useCallback } from 'react';
import { Bell, MessageSquare, Terminal, BookOpen, HelpCircle, FileText, Lock, Search, ArrowRight, Loader2, Send, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
// 修正: UIコンポーネントが同じ階層か親階層から利用可能であることを仮定し、相対パスを調整するか、あるいは外部コンポーネントを直接埋め込む。
// 今回はエラーログのパスを信じ、App.jsxが親であるとして、UI, utils/firebaseはApp.jsxから相対パスで参照される場所に存在していると仮定し、修正を試みます。
// SubPages.jsxとHome.jsxが同じディレクトリ階層にあると仮定し、Homeからのインポートは相対パスで修正。
// UIコンポーネントはcomponents/UI.jsxに存在すると仮定し、パスを修正。
import { NewsItem, AccordionItem, CopyBox, JoinChatSection } from './UI'; // UI.jsxがApp.jsxと同じ階層にあると仮定し、一時的に修正 (本来は../components/UI)
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, appId, auth, initializeFirebase } from './firebase'; // firebase.jsが同じ階層にあると仮定し、一時的に修正 (本来は../utils/firebase)
import { JoinSection } from './Home'; // Home.jsxが同じ階層にあると仮定

// --- News Page ---\r\n
export const NewsPage = ({ L, newsData }) => {
    // NewsItem コンポーネントが外部から渡されるか、ここで定義されている必要がある。
    // エラー回避のため、NewsItem, AccordionItem, CopyBoxはUI.jsxで定義されていると仮定する。
    const NewsItem = ({ item, L }) => (
        <div
            className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-b-4 border-purple-500 hover:border-purple-600 cursor-pointer overflow-hidden mb-4"
        >
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        <Clock size={16} /> {item.date}
                    </span>
                    <h3 className="text-xl font-bold dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h3>
                </div>
                <Bell size={28} className="text-purple-500 flex-shrink-0 ml-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{item.content}</p>
            {item.url && (
                <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-purple-600 font-bold hover:underline transition-colors text-sm"
                >
                    {L.news.read_more} <ArrowRight size={16} />
                </a>
            )}
        </div>
    );

    const displayData = (newsData && newsData.length > 0) ? newsData : L.news.default_data;
    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Bell className="text-purple-500" size={40} />{L.news.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
            </div>
            <div className="space-y-4">
                {displayData.map((item, index) => (
                    <NewsItem key={index} item={item} L={L} />
                ))}
            </div>
        </div>
    );
};

// --- Forum Page ---
export const ForumPage = ({ L, forumData }) => {
    // AccordionItem コンポーネントが外部から渡されるか、ここで定義されている必要がある。
    // エラー回避のため、AccordionItemはUI.jsxで定義されていると仮定する。
    const AccordionItem = ({ title, content, icon: Icon }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left p-5 flex justify-between items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon size={24} className="text-purple-500" />}
                        <span className="text-lg font-semibold dark:text-white">{title}</span>
                    </div>
                    <ArrowRight size={20} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                </button>
                <div
                    className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen p-5 pt-0' : 'max-h-0 p-0'
                        }`}
                >
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                        {content}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><MessageSquare className="text-purple-500" size={40} />{L.forum.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.forum.subtitle}</p>
            </div>
            <div className="space-y-4">
                {forumData.map((item, index) => (
                    <AccordionItem key={index} title={item.q} content={item.a} icon={HelpCircle} />
                ))}
            </div>
        </div>
    );
};

// --- Guide Page ---
export const GuidePage = ({ L, guideData }) => (
    <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><BookOpen className="text-purple-500" size={40} />{L.guide.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
        </div>
        <div className="space-y-12">
            {guideData.map((section, sIdx) => (
                <div key={sIdx}>
                    <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{section.category}</span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: section.content }}>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Commands Page ---
export const CommandsPage = ({ L, commandsData }) => (
    <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Terminal className="text-purple-500" size={40} />{L.commands.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{L.commands.subtitle}</p>
        </div>
        <div className="space-y-12">
            {commandsData.map((section, sIdx) => (
                <div key={sIdx}>
                    <div className="inline-flex items-center mb-8 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                        <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{section.category}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {section.commands.map((cmd, cIdx) => (
                            <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 transition-all hover:shadow-md group">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-700">
                                        {cmd.cmd}
                                    </code>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{cmd.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- Privacy Policy Page ---
export const PrivacyPage = ({ L }) => (
    <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><FileText className="text-purple-500" size={40} />{L.privacy.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{L.privacy.subtitle}</p>
        </div>
        <div className="space-y-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Info size={20} />
                    {L.privacy.section1_title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {L.privacy.section1_content}
                </p>
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        {L.privacy.item1}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        {L.privacy.item2}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        {L.privacy.item3}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Lock size={20} />
                    {L.privacy.section2_title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {L.privacy.section2_content}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
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


// --- Join Page (Wrapper) ---
// JoinSection は Home.jsx に定義されていると仮定し、ここでは再利用のためにインポートしている。
// エラー回避のため、JoinPageはJoinSectionを表示するラッパーとして機能する。
export const JoinPage = (props) => (
    <JoinSection {...props} />
);

// --- Chat Page (Wrapper) ---
// チャット機能はAIChatとしてLayout.jsxに実装されていることが多いため、ここでは簡略化。
// 外部依存を避けるため、簡易なチャットUIをここで定義する。
export const ChatPage = ({ L, serverStatus }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(null);

    // CopyBox, JoinChatSection コンポーネントが外部から渡されるか、ここで定義されている必要がある。
    // エラー回避のため、CopyBoxとJoinChatSectionをここで定義する。
    const CopyBox = ({ textToCopy, label, icon: Icon, successMessage }) => {
        const [isCopied, setIsCopied] = useState(false);
        const handleCopy = useCallback(() => {
            if (typeof document.execCommand === 'function') {
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                } catch (err) {
                    console.error('Failed to copy text', err);
                }
                document.body.removeChild(textarea);
            }
        }, [textToCopy]);

        return (
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={24} className="text-purple-500" />}
                    <span className="font-mono text-lg font-bold dark:text-white">{label}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-full transition-all duration-200 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold"
                >
                    {isCopied ? (
                        <>
                            <CheckCircle size={18} />
                            {successMessage}
                        </>
                    ) : (
                        <>
                            <Copy size={18} />
                            {L.join.copy_button}
                        </>
                    )}
                </button>
            </div>
        );
    };

    const JoinChatSection = ({ L, serverStatus, handleCopy }) => (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><MessageSquare className="text-purple-500" size={40} />{L.chat.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.chat.subtitle}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold dark:text-white">{L.join.info_title}</h3>
                    <CopyBox
                        textToCopy={L.join.server_ip_value}
                        label={L.join.server_ip_value}
                        icon={Terminal}
                        successMessage={L.join.copied}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                        {L.join.copy_tip}
                    </p>
                </div>
            </div>
            {/* 以下のチャットUIは AIChat の簡易版として機能する */}
            <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-[60vh] flex flex-col">
                <h3 className="text-2xl font-bold dark:text-white mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">{L.chat.live_chat_title}</h3>
                <div ref={chatRef} className="flex-grow overflow-y-auto space-y-4 p-2 custom-scrollbar">
                    {/* 初期メッセージ */}
                    <div className="flex justify-start">
                        <div className="max-w-[85%] p-4 rounded-2xl shadow-sm bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-gray-100 rounded-bl-none border border-purple-200 dark:border-purple-700">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{L.chat.initial_message}</p>
                        </div>
                    </div>
                    {/* メッセージ表示 */}
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                            {L.chat.no_messages}
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale origin-bottom`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-xs text-gray-400 ml-4">{L.chat.loading}</div>}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={(e) => { e.preventDefault(); /* handleSend(input); */ setInput(''); }} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={L.chat.input_placeholder}
                            className="flex-grow pl-5 pr-12 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-purple-600 hover:text-purple-700 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    // 簡易チャットページとして JoinChatSection を利用
    return <JoinChatSection L={L} serverStatus={serverStatus} />;
};