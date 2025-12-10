import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle, AlertCircle,
    Server, Users, Shield, Clock, MessageCircle, MessageSquare, MapPin, User,
    HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal, Zap, ArrowRight, BookOpen,
    Pencil as PencilIcon, Trash as TrashIcon, CheckCircle as CheckCircleIcon, 
    LogOut as ArrowLeftOnRectangleIcon, UploadCloud as CloudArrowUpIcon,
    Sparkles, Loader2, Send, FileText, Search
} from 'lucide-react';
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    onSnapshot, 
    serverTimestamp, 
    addDoc, 
    increment,
    getDocs,
    writeBatch,
    getCountFromServer
} from 'firebase/firestore';
import { 
    signInAnonymously, 
    onAuthStateChanged, 
    signInWithCustomToken, 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut 
} from 'firebase/auth';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { Navbar, Footer } from './components';
import { ForumPage, GuidePage, CommandsPage, TermsPage, PrivacyPage, NotFoundPage } from './pages';
import { JoinSection } from './pages/Home';
import { app, auth, firebaseConfig } from './config/firebase';
import { SPREADSHEET_ID, SHEET_GID, NEWS_SHEET_URL, DISCORD_WEBHOOK_URL } from './config/constants';
import { LANGUAGES } from './config/languages';
import { formatCorrectedDate } from './utils/helpers';

// ==========================================
// 1. Configuration & Data (languages.js)
// ==========================================

// Firebase and helper functions now imported from config and utils
// (firebaseConfig, app, formatCorrectedDate)

// LANGUAGES object now imported from './config/languages'

// ==========================================
// 2. UI Components (UI.jsx)
// ==========================================

export const LoadingScreen = () => (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950 flex flex-col items-center justify-center animate-fade-out pointer-events-none transition-opacity duration-700">
        <div className="text-center relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse"></div>
            <div className="relative z-10 w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-purple-500/30 ring-1 ring-gray-100 dark:ring-white/10">
                <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Loading" className="w-20 h-20 rounded-xl object-cover" />
            </div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-black tracking-wider mb-2 animate-fade-in-up">Nantetu Server</h1>
            <p className="text-purple-600 dark:text-purple-400 font-bold text-sm tracking-[0.2em] animate-pulse">INITIALIZING...</p>
        </div>
    </div>
);

export const LoadingBar = ({ isLoading }) => (
    <div className={`fixed top-0 left-0 w-full h-1 z-[10000] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        {isLoading && <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-progress shadow-[0_0_15px_rgba(168,85,247,0.7)] w-full"></div>}
    </div>
);

export const Toast = ({ message }) => (
    <div className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in-up z-50 border-l-4 border-purple-500 ring-1 ring-black/5 max-w-sm">
        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <span className="font-bold text-sm md:text-base">{message}</span>
    </div>
);

export const FeatureCard = ({ icon: Icon, title, description, colorClass, bgClass, onClick }) => (
    <div
        onClick={onClick}
        className={`glass-panel p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group relative overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-2' : 'hover:-translate-y-1'}`}
    >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${bgClass} bg-opacity-10 dark:bg-opacity-20 shadow-inner relative z-10 ring-1 ring-white/10`}>
            <Icon size={32} className={`${colorClass} transform group-hover:scale-110 transition-transform duration-300`} />
        </div>
        <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{description}</p>
        {onClick && (
            <div className="mt-4 flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                詳細を見る <ArrowRight size={14} className="ml-1" />
            </div>
        )}
    </div>
);

// Improved CopyBox Component
export const CopyBox = ({ label, value, onCopy, lang }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = () => {
        onCopy(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="text-center sm:text-left w-full overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-1">
                        {label}
                    </p>
                    <p className="font-mono text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight truncate w-full" title={value}>{value}</p>
                </div>
                <button
                    onClick={handleCopyClick}
                    className={`flex-shrink-0 font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95 border
            ${isCopied
                            ? 'bg-green-500 text-white border-green-500 shadow-green-500/30'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 border-transparent hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 hover:shadow-purple-500/30'
                        }`}
                >
                    {isCopied ? <CheckCircle size={18} className="animate-bounce" /> : <Copy size={18} />}
                    <span className="uppercase text-sm">
                        {isCopied
                            ? LANGUAGES[lang].join.copy_success
                            : LANGUAGES[lang].join.copy_action || 'Copy'}
                    </span>
                </button>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150 group-hover:from-purple-500/10 pointer-events-none"></div>
        </div>
    );
};

export const AccordionItem = ({ title, content, isOpen, toggle }) => (
    <div className={`border rounded-xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg ring-2 ring-purple-500/20 border-purple-500 bg-white dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-white/50 dark:bg-gray-800/50'}`}>
        <button
            onClick={toggle}
            className={`w-full flex items-center justify-between p-5 text-left font-bold text-lg transition-colors ${isOpen ? 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10' : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750'}`}
        >
            <span className="flex items-center gap-3">
                {isOpen ? <Sparkles size={18} className="text-purple-500 animate-pulse" /> : <HelpCircle size={18} className="text-gray-400" />}
                {title}
            </span>
            {isOpen ? <ChevronUp size={20} className="text-purple-500" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                {Array.isArray(content) ? (
                    <ul className="space-y-3">
                        {content.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1 flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 rounded-full p-0.5">
                                    <CheckCircle size={14} />
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>{content}</div>
                )}
            </div>
        </div>
    </div>
);

export const NewsItem = ({ item, L }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getTypeConfig = (type) => {
        switch (type) {
            case 'maintenance': return { label: L.news.maintenance, style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' };
            case 'request': return { label: L.news.request, style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' };
            case 'explanation': return { label: L.news.explanation, style: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' };
            case 'recruitment': return { label: L.news.recruitment, style: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50' };
            case 'other': return { label: L.news.other, style: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' };
            default: return { label: L.news.info, style: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' };
        }
    };
    const config = getTypeConfig(item.type);

    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${isOpen ? 'ring-2 ring-purple-500/20 shadow-lg' : ''}`}
        >
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-between">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider w-fit border ${config.style}`}>
                            {config.label}
                        </span>
                        <span className="text-gray-400 text-sm font-bold flex items-center gap-1.5"><Clock size={14} /> {formatCorrectedDate(item.date)}</span>
                    </div>
                    <div className="text-gray-300 group-hover:text-purple-500 transition-colors self-end md:self-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-full">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 dark:text-white leading-tight">{item.title}</h3>

                <div className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 text-sm md:text-base ${isOpen ? 'line-clamp-none' : 'line-clamp-2'}`}>
                    {item.content}
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-20 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
                    <div className="flex gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.hash = `/news/${item.id}`;
                            }}
                            className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            詳細を見る <ArrowRight size={16} />
                        </button>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                {L.news.link_text} <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. Layout Components (Layout.jsx)
// ==========================================

// Navbar and Footer are now imported from ./components

export const AIChat = ({ L, isChatOpen, closeChat, currentLang, user, profile }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chatHistory]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', text: input.trim() };
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            // Check API Key availability
            // Serverless API call does not require client-side apiKey check


            const systemPrompt = `
            あなたは「なんてつサーバー」の公式AIアシスタントです。
            以下の情報を元に、ユーザーの質問に親切に答えてください。
            また、嘘の情報を言わずに、本当の情報だけを言い、サーバーに関係のない話には、「私は なんてつサーバー 以外の情報は提供できません。」と答えましょう。
            そして、回答する際、極力500トークン以内で回答するようにしてください。

            【サーバー情報】
            - 統合版(Bedrock)専用
            - IP: ${L.server.ip}
            - Port: ${L.server.port}
            - 参加タグ: ${L.server.tag}
            - 特徴: 土地保護あり、荒らし対策ログ完備、Discord連携、Java版のような機能(/tpa, /home等)

            【ルール】
            - 荒らし、窃盗、チート禁止（永久BAN）
            - 差別発言、ハラスメント禁止
            - 他人の拠点から5マス以上離れて建築すること

            【コマンド】
            移動・テレポート系 (Essentials)
            - /tpa <プレイヤー名>
            - 指定したプレイヤーにテレポートをリクエストします。

            - /tpaccept
            - /tpa のリクエストを承認します。

            - /tpdeny
            - /tpa のリクエストを拒否します。

            - /back
            - 最後にテレポートした場所、または死んだ場所に戻ります。

            - /sethome
            - 現在地をホームポイントとして設定します。

            - /home
            - 設定したホームにテレポートします。

            - /spawn
            - サーバーの初期スポーン地点に戻ります。

            - /warp
            - 運営が設定した公共施設へ移動します。

            領地・保護・ログ系 (Territory / Tianyan)
            - /tty
            - 自分の領地として設定します。(事前に範囲座標のメモが必要)

            - /tygui
            - 監査ログをGUIで確認します。荒らし特定に便利です。

            - /ty x y z <時間> <半径>
            - チャットで検索し監査ログを確認します。（上級者向け）

            経済・コミュニケーション (UMoney / Essentials)
            - /um
            - 自分の所持金（マネー）を確認します。

            - /um → <送金>
            - 指定したプレイヤーにお金を送金します。

            - /um → <ランキング>
            - 所持金のサーバー内ランキングを確認します。

            - /msg <プレイヤー名> <内容>
            - 指定したプレイヤーに個人メッセージ（DM）を送ります。

            - /ping
            - サーバーとの接続遅延(Ping値)を確認します。

            - /notice
            - サーバーからのお知らせを確認します。

            ロールプレイ系 (RolePlay)
            - /e <アクション>
            - チャットにアクション（感情表現）を送信します。（例: /e happy）

            【初心者ガイド】
            - スポーンしたら混雑していない場所へ移動
            - 5ブロック離れて建築
            - /ttyで土地保護
            - Discordに参加推奨
            `;

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `
                System Prompt: ${systemPrompt}
                User Message: ${input.trim()}
                `
                })
            });

            const data = await response.json();
            const reply = data.result || "すみません、うまく答えられませんでした。";

            setChatHistory(prev => [...prev, { role: 'model', text: reply }]);
        } catch (error) {
            console.error("AI Error:", error);
            setChatHistory(prev => [...prev, { role: 'model', text: "エラーが発生しました。時間を置いて再試行してください。" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => setChatHistory([]);
    if (!isChatOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex md:justify-end animate-fade-in" onClick={closeChat}>
            <div
                className="bg-white dark:bg-gray-900 w-full md:w-[420px] md:max-w-md h-full flex flex-col shadow-2xl transform transition-all duration-300 ease-out border-l border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-in-bottom md:animate-slide-in-right"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
                    <div><h3 className="text-lg font-black flex items-center gap-2"><Zap size={20} className="text-yellow-300 fill-current" />{L.footer.chat_title}</h3><p className="text-xs text-purple-200 opacity-90">Powered by Gemini</p></div>
                    <div className="flex items-center gap-1">
                        <button onClick={handleClear} disabled={chatHistory.length === 0} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"><Trash2 size={18} /></button>
                        <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><X size={24} /></button>
                    </div>
                </div>
                <div ref={chatRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-black/20">
                    {chatHistory.length === 0 ? (
                        <div className="text-center p-8 pt-20 text-gray-500 dark:text-gray-400 animate-fade-in-up">
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Bot size={36} className="text-purple-500" /></div>
                            <p className="font-bold text-lg mb-2">{L.footer.chat_subtitle}</p>
                        </div>
                    ) : (
                        chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale origin-bottom`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && <div className="text-xs text-gray-400 ml-4">{L.footer.chat_loading}</div>}
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <form onSubmit={handleSend} className="flex gap-2 relative">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={L.footer.chat_input_placeholder} className="flex-grow pl-5 pr-12 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" disabled={isLoading} />
                        <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center shadow-md"><Send size={18} /></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. Sub Pages (SubPages.jsx)
// ==========================================

export const NewsPage = ({ L, newsData, user, profile }) => {
    const displayData = (newsData && newsData.length > 0) ? newsData : L.news.default_data;
    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Bell className="text-purple-500" size={40} />{L.news.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
            </div>
            <div className="space-y-6">
                {displayData.map((item) => (
                    <NewsItem key={item.id} item={item} L={L} />
                ))}
            </div>
        </div>
    );
};

export const NewsDetail = ({ L, id, newsData, navigate, user, profile }) => {
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (newsData) {
            const found = newsData.find(i => String(i.id) === String(id));
            setItem(found);
        }
    }, [newsData, id]);

    if (!item) return <div className="max-w-4xl mx-auto py-32 px-4 text-center">お知らせが見つかりません。</div>;

    const getTypeConfig = (type) => {
        switch (type) {
            case 'maintenance': return { label: L.news.maintenance, style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' };
            case 'request': return { label: L.news.request, style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' };
            case 'explanation': return { label: L.news.explanation, style: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' };
            case 'recruitment': return { label: L.news.recruitment, style: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50' };
            case 'other': return { label: L.news.other, style: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' };
            default: return { label: L.news.info, style: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' };
        }
    };
    const config = getTypeConfig(item.type);

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="mb-8">
                <button onClick={() => navigate('news')} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-bold">
                    <ArrowRight size={18} className="rotate-180" /> {L.news.title}に戻る
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                    <span className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider w-fit border ${config.style}`}>
                        {config.label}
                    </span>
                    <span className="text-gray-400 font-bold flex items-center gap-2"><Clock size={16} /> {formatCorrectedDate(item.date)}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-8 dark:text-white leading-tight">{item.title}</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                        {item.content}
                    </ReactMarkdown>
                </div>
                {item.url && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                            {L.news.link_text} <ExternalLink size={20} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ArticlesPage = ({ L, db, appId, navigate, user, profile }) => {
    const [articles, setArticles] = useState([]);

    // Markdownから最初の画像URLを抽出する関数
    const extractFirstImage = (markdown) => {
        if (!markdown) return null;
        // Markdown画像記法 ![alt](url) から画像URLを抽出
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
        } else {
            try {
                const local = JSON.parse(localStorage.getItem('admin_articles_v1') || '[]');
                setArticles(local);
            } catch { setArticles([]); }
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
                            {/* サムネイル画像 */}
                            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                <img
                                    src={thumbnailUrl}
                                    alt={a.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { e.target.src = '/images/Image Not Found.png'; }}
                                />
                            </div>
                            {/* コンテンツ部分 */}
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

// 記事詳細 + コメント機能
const ArticleDetail = ({ L, id, db, appId, navigate, user, profile }) => {
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

    const isGoogleUser = user && !user.isAnonymous;

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
        html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>');
        html = html.replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold my-2">$1</h4>');
        html = html.replace(/^##### (.*$)/gm, '<h5 class="text-base font-bold my-2">$1</h5>');
        html = html.replace(/^###### (.*$)/gm, '<h6 class="text-sm font-bold my-2">$1</h6>');

        html = html.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6">$2</li>');
        html = html.replace(/^[-*+] (.*$)/gm, '<li class="ml-6">$1</li>');

        html = html.replace(/(<li class="ml-6">.*<\/li>)(?=\n[^<])/gs, (match) => {
            return `<ul class="list-disc my-2 pl-6">${match}</ul>`;
        });

        html = html.replace(/\|(.+)\n\|( *[-:]+[-| :]*)\n((?:.*\n)*?)\n(?=\S|$)/g, (match, header, align, rows) => {
            const columns = header.split('|').map(col => col.trim());
            const aligns = align.split('|').map(col => {
                const a = col.trim();
                if (a.startsWith(':') && a.endsWith(':')) return 'center';
                if (a.endsWith(':')) return 'right';
                return 'left';
            });

            let table = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse"><thead><tr>';
            columns.forEach((col, i) => {
                if (col) {
                    table += `<th class="border border-gray-300 px-4 py-2 text-left" style="text-align: ${aligns[i] || 'left'}">${col}</th>`;
                }
            });
            table += '</tr></thead><tbody>';

            const rowData = rows.split('\n').filter(row => row.trim() !== '');
            rowData.forEach(row => {
                const cells = row.split('|').map(cell => cell.trim());
                table += '<tr>';
                cells.forEach((cell, i) => {
                    if (i > 0 && i < cells.length) {
                        table += `<td class="border border-gray-300 px-4 py-2" style="text-align: ${aligns[i] || 'left'}">${cell}</td>`;
                    }
                });
                table += '</tr>';
            });

            table += '</tbody></table></div>';
            return table;
        });

        html = html.replace(/^(\s*)- \[ \] (.*$)/gm, '<li class="flex items-center ml-6"><input type="checkbox" class="mr-2" disabled> $2</li>');
        html = html.replace(/^(\s*)- \[x\] (.*$)/gim, '<li class="flex items-center ml-6"><input type="checkbox" class="mr-2" checked disabled> $2</li>');

        html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 text-gray-600 dark:text-gray-300">$1</blockquote>');

        html = html.replace(/^\s*([-*_]\s*){3,}\s*$/gm, '<hr class="my-4 border-t border-gray-300">');

        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
            const safeSrc = src.startsWith('https://') ? src : '';
            return `<div class="my-4"><img src="${safeSrc}" alt="${alt}" class="max-w-full rounded-md" loading="lazy" onerror="this.style.display='none'"></div>`;
        });

        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer nofollow" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300">$1</a>'
        );

        html = html.replace(/\n/g, '<br>');

        return html;
    }, []);

    // 記事データの取得
    useEffect(() => {
        if (!db || !id) return;

        const fetchArticle = async () => {
            try {
                const docRef = doc(db, 'articles', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const articleData = {
                        id: docSnap.id,
                        ...docSnap.data()
                    };
                    setArticle(articleData);
                    setContent(simpleRenderMarkdown(articleData.md || ''));
                }
            } catch (error) {
                console.error('記事の読み込み中にエラーが発生しました:', error);
            }
        };

        fetchArticle();
    }, [db, id, simpleRenderMarkdown]);

    // コメントの購読
    useEffect(() => {
        if (!db || !id) return;

        try {
            const commentsRef = collection(db, 'article_comments');
            const q = query(
                commentsRef,
                where('articleId', '==', id),
                orderBy('createdAt', 'asc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setComments(loaded);
            }, (error) => {
                console.error('コメントの読み込みに失敗しました:', error);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('コメント購読中にエラーが発生しました:', error);
        }
    }, [db, id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!db || !id) return;
        if (!newCommentText.trim()) return;

        setIsSendingComment(true);
        try {
            await addDoc(collection(db, 'article_comments'), {
                articleId: id,
                parentId: null,
                uid: user && !user.isAnonymous ? user.uid : null,
                name: (isGoogleUser && profile?.name) ? profile.name : (newCommentName.trim() || (L.forum?.anonymous || '名無しさん')),
                text: newCommentText.trim(),
                createdAt: serverTimestamp(),
            });
            setNewCommentText('');
        } catch (error) {
            console.error('コメント投稿に失敗しました:', error);
        } finally {
            setIsSendingComment(false);
        }
    };

    const handleOpenReply = (commentId, name) => {
        setReplyToId(commentId);
        setReplyText('');
        setReplyName(name || '');
    };

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!db || !id || !replyToId) return;
        if (!replyText.trim()) return;

        setIsSendingReply(true);
        try {
            await addDoc(collection(db, 'article_comments'), {
                articleId: id,
                parentId: replyToId,
                uid: user && !user.isAnonymous ? user.uid : null,
                name: (isGoogleUser && profile?.name) ? profile.name : (replyName.trim() || (L.forum?.anonymous || '名無しさん')),
                text: replyText.trim(),
                createdAt: serverTimestamp(),
            });
            setReplyText('');
            setReplyToId(null);
        } catch (error) {
            console.error('返信の投稿に失敗しました:', error);
        } finally {
            setIsSendingReply(false);
        }
    };

    if (!article) {
        return <div className="max-w-4xl mx-auto py-24 px-4 text-center">読み込み中...</div>;
    }

    const rootComments = comments.filter(c => !c.parentId);
    const repliesByParent = comments.reduce((map, c) => {
        if (!c.parentId) return map;
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
        return map;
    }, {});

    return (
        <div className="max-w-4xl mx-auto py-24 px-4 animate-fade-in">
            <h1 className="text-4xl font-black mb-2 dark:text-white">{article.title}</h1>
            <div className="text-sm text-gray-500 mb-6">
                {article.date} • {article.type}
            </div>
            <div
                className="prose dark:prose-invert max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* 記事コメントエリア（YouTube風） */}
            <section className="mt-8 mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="text-purple-500" size={22} />
                    <h2 className="text-2xl font-bold dark:text-white">コメント</h2>
                    <span className="text-sm text-gray-500">{rootComments.length} 件</span>
                </div>

                {/* 新規コメント入力 */}
                <form onSubmit={handleSubmitComment} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
                    {!isGoogleUser && (
                        <div className="flex flex-col md:flex-row gap-3 mb-3">
                            <input
                                type="text"
                                value={newCommentName}
                                onChange={(e) => setNewCommentName(e.target.value)}
                                placeholder={L.forum?.input_name || '名前 (任意)'}
                                className="w-full md:w-1/3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white text-sm"
                            />
                        </div>
                    )}
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={L.forum?.input_message || 'コメントを入力...'}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none text-sm"
                    />
                    <div className="flex justify-end items-center gap-3 mt-3">
                        <p className="text-xs text-gray-400 hidden md:block">※不適切なコメントは削除される場合があります。</p>
                        <button
                            type="submit"
                            disabled={isSendingComment || !newCommentText.trim()}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
                        >
                            {isSendingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {isSendingComment ? (L.forum?.sending || '送信中...') : (L.forum?.send || 'コメントを投稿')}
                        </button>
                    </div>
                </form>

                {/* コメント一覧 */}
                <div className="space-y-4">
                    {rootComments.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
                            <p>{L.forum?.no_posts || 'まだコメントはありません。'}</p>
                        </div>
                    )}

                    {rootComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white dark:bg-gray-900/80 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm"
                        >
                            <div className="flex items-start gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => comment.uid && navigate(`user/${comment.uid}`)}
                                    className={comment.uid ? "w-9 h-9 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs cursor-pointer" : "w-9 h-9 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs"}
                                >
                                    {(comment.name || 'N').charAt(0)}
                                </button>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <button
                                            type="button"
                                            onClick={() => comment.uid && navigate(`user/${comment.uid}`)}
                                            className={comment.uid ? "font-bold text-sm text-purple-900 dark:text-purple-300 hover:underline cursor-pointer" : "font-bold text-sm text-purple-900 dark:text-purple-300"}
                                        >
                                            {comment.name || (L.forum?.anonymous || '名無しさん')}
                                        </button>

                                        <span className="text-[11px] text-gray-400">
                                            {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleString() : ''}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                        {comment.text}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenReply(comment.id, comment.name)}
                                        className="mt-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                                    >
                                        返信する
                                    </button>
                                </div>
                            </div>

                            {/* 返信一覧 */}
                            {repliesByParent[comment.id] && (
                                <div className="mt-3 pl-6 border-l border-gray-200 dark:border-gray-700 space-y-3">
                                    {repliesByParent[comment.id].map((reply) => (
                                        <div key={reply.id} className="flex items-start gap-3">
                                            <button
                                                type="button"
                                                onClick={() => reply.uid && navigate(`user/${reply.uid}`)}
                                                className={reply.uid ? "w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-400 to-sky-400 flex items-center justify-center text-white font-bold text-[10px] cursor-pointer" : "w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-400 to-sky-400 flex items-center justify-center text-white font-bold text-[10px]"}
                                            >
                                                {(reply.name || 'N').charAt(0)}
                                            </button>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => reply.uid && navigate(`user/${reply.uid}`)}
                                                        className={reply.uid ? "font-bold text-xs text-purple-900 dark:text-purple-300 hover:underline cursor-pointer" : "font-bold text-xs text-purple-900 dark:text-purple-300"}
                                                    >
                                                        {reply.name || (L.forum?.anonymous || '名無しさん')}
                                                    </button>

                                                    <span className="text-[10px] text-gray-400">
                                                        {reply.createdAt?.toDate ? reply.createdAt.toDate().toLocaleString() : ''}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                    {reply.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 返信フォーム */}
                            {replyToId === comment.id && (
                                <form onSubmit={handleSubmitReply} className="mt-3 pl-6">
                                    {!isGoogleUser && (
                                        <div className="flex flex-col md:flex-row gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={replyName}
                                                onChange={(e) => setReplyName(e.target.value)}
                                                placeholder={L.forum?.input_name || '名前 (任意)'}
                                                className="w-full md:w-1/3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white text-xs"
                                            />
                                        </div>
                                    )}
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={L.forum?.input_message || '返信を入力...'}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none text-xs mb-2"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setReplyToId(null)}
                                            className="px-3 py-1.5 rounded-xl text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            キャンセル
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSendingReply || !replyText.trim()}
                                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white flex items-center gap-1"
                                        >
                                            {isSendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                            {isSendingReply ? (L.forum?.sending || '送信中...') : '返信を投稿'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-10">
                <button
                    onClick={() => navigate('articles')}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-semibold"
                >
                    戻る
                </button>
            </div>
        </div>
    );
};

// ==========================================
// 5. Admin Page
// ==========================================
export const AdminPage = ({ L, user, db, appId, showToast }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [keyInput, setKeyInput] = useState('');
    const [warningAck, setWarningAck] = useState(false);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [type, setType] = useState('info');
    const [md, setMd] = useState('');
    const [editingId, setEditingId] = useState(null);
    const fileRef = useRef(null);

    // コメント管理用 state
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('admin_logged_in') === '1') {
            setLoggedIn(true);
        }
    }, []);

    // 記事一覧のリアルタイム購読
    useEffect(() => {
        if (!db || !loggedIn) {
            setLoading(false);
            return;
        }

        const articlesRef = collection(db, 'articles');
        const q = query(articlesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const articlesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date || new Date(doc.data().createdAt?.toDate() || Date.now()).toISOString().slice(0, 10),
            }));
            setArticles(articlesData);
            setLoading(false);
        }, (error) => {
            console.error('Failed to load articles:', error);
            showToast?.(L?.errorLoadingArticles || '記事の読み込みに失敗しました', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db, loggedIn, L, showToast]);

    // コメント一覧のリアルタイム購読
    useEffect(() => {
        if (!db || !loggedIn) {
            setCommentsLoading(false);
            return;
        }

        const commentsRef = collection(db, 'article_comments');
        const qComments = query(commentsRef, orderBy('createdAt', 'desc'), limit(100));

        const unsubscribe = onSnapshot(qComments, (snapshot) => {
            const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(loaded);
            setCommentsLoading(false);
        }, (error) => {
            console.error('コメントの読み込みに失敗しました:', error);
            setCommentsLoading(false);
        });

        return () => unsubscribe();
    }, [db, loggedIn]);

    const simpleRenderMarkdown = useCallback((text) => {
        if (!text) return '';
        let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html = html.replace(/```([\s\S]*?)```/g, (m, code) => `<pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded">${code.replace(/</g, '&lt;')}</pre>`);
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-md my-3" loading="lazy" />');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-purple-600 dark:text-purple-400 underline">$1</a>');
        html = html.replace(/\n/g, '<br />');
        return html;
    }, []);

    useEffect(() => {
        localStorage.setItem('admin_articles_v1', JSON.stringify(articles));
    }, [articles]);

    const handleLogin = async () => {
        if (!keyInput.trim()) {
            showToast?.('管理者キーを入力してください。', 'warning');
            return;
        }

        try {
            const response = await fetch('/api/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyInput }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('admin_logged_in', '1');
                setLoggedIn(true);
                showToast?.('ログインに成功しました', 'success');
            } else {
                showToast?.(data.message || '認証に失敗しました。', 'error');
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('API Call Error:', error);
            showToast?.('ログイン処理中にネットワークエラーが発生しました。', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_logged_in');
        setLoggedIn(false);
        showToast?.('ログアウトしました', 'info');
        clearForm();
    };

    const clearForm = () => {
        setTitle('');
        setDate(new Date().toISOString().slice(0, 10));
        setType('info');
        setMd('');
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            showToast?.('タイトルを入力してください', 'warning');
            return;
        }

        const obj = {
            title: title.trim(),
            date,
            type,
            md,
            html: simpleRenderMarkdown(md),
        };

        const size = new Blob([JSON.stringify(obj)]).size;
        if (size > 1000000) {
            showToast?.(`記事のサイズが大きすぎます(${Math.round(size / 1024)} KB)。画像は外部URLを使用し、Base64の埋め込みを避けてください。(Firestoreの上限は 1MB です)`, 'error');
            return;
        }

        if (!db) {
            showToast?.('データベースが利用できません。記事を保存するには、Firebaseをセットアップしてください。', 'error');
            return;
        }

        try {
            if (editingId) {
                const docRef = doc(db, 'articles', editingId);
                await updateDoc(docRef, { ...obj, updatedAt: serverTimestamp() });
                showToast?.('記事を更新しました', 'success');
            } else {
                await addDoc(collection(db, 'articles'), {
                    ...obj,
                    author: user?.uid || 'admin',
                    createdAt: serverTimestamp(),
                });
                showToast?.('新しい記事を公開しました', 'success');
            }
        } catch (e) {
            console.error('Firestore save failed', e);
            const errorMessage = e.code === 'permission-denied'
                ? 'Firestoreへの保存権限がありません。セキュリティルールを確認してください。'
                : `Firestoreへの保存に失敗しました: (${e.message})`;
            showToast?.(errorMessage, 'error');
        }

        clearForm();
    };

    const handleEdit = (a) => {
        setEditingId(a.id);
        setTitle(a.title);
        setDate(a.date);
        setType(a.type);
        setMd(a.md || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId || !db) return;
        try {
            await deleteDoc(doc(db, 'articles', deletingId));
            showToast?.('記事を完全に削除しました', 'success');
        } catch (e) {
            console.error('Firestore deletion failed:', e);
            showToast?.('Firestoreからの削除に失敗しました', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleExport = async () => {
        try {
            const dataToCopy = JSON.stringify(articles, null, 2);
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = dataToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            showToast?.('記事データをクリップボードにコピーしました。', 'success');
        } catch (e) {
            console.error(e);
            showToast?.('クリップボードへのコピーに失敗しました。', 'error');
        }
    };

    const handleDeleteComment = (id) => {
        setDeletingCommentId(id);
    };

    const confirmDeleteComment = async () => {
        if (!deletingCommentId || !db) return;
        try {
            await deleteDoc(doc(db, 'article_comments', deletingCommentId));
            showToast?.('コメントを削除しました', 'success');
        } catch (e) {
            console.error('コメント削除に失敗しました:', e);
            showToast?.('コメントの削除に失敗しました', 'error');
        } finally {
            setDeletingCommentId(null);
        }
    };

    const typeStyles = {
        info: { text: 'お知らせ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        request: { text: 'お願い', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
        maintenance: { text: 'メンテナンス', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
        explanation: { text: '解説', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        recruitment: { text: '募集', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    };

    const extractFirstImage = (markdown) => {
        if (!markdown) return null;
        const imgRegex = /!\[([^\]]*)\]\((.*?)\)/;
        const match = markdown.match(imgRegex);
        return match ? match[2] : null;
    };

    const ArticleCard = ({ article, onEdit, onDelete, isDeleting }) => {
        const style = typeStyles[article.type] || typeStyles.info;
        const imageUrl = extractFirstImage(article.md);

        return (
            <div className={`
                relative bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all transform hover:shadow-xl
                ${article.id === editingId ? 'ring-4 ring-purple-500/50' : 'hover:scale-[1.01]'}
            `}>
                <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-t-xl overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={article.title}
                            className="object-cover w-full h-full"
                            loading="lazy"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/808080/FFFFFF?text=Image+Load+Error"; }}
                        />
                    ) : (
                        <GlobeIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    )}
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${style.color}`}>
                            {style.text}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {article.date}
                        </span>
                    </div>

                    <h4 className="text-lg font-semibold dark:text-white line-clamp-2">
                        {article.title}
                    </h4>

                    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        {isDeleting ? (
                            <>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2 text-sm font-bold rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700 active:scale-95">
                                    <CheckCircleIcon className="w-5 h-5 inline-block mr-1" />
                                    本当に削除しますか?
                                </button>
                                <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white transition-colors hover:bg-gray-300 active:scale-95">
                                    キャンセル
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => onEdit(article)} className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg bg-purple-500 text-white transition-colors hover:bg-purple-600 active:scale-95">
                                    <PencilIcon className="w-4 h-4" /> 編集
                                </button>
                                <button onClick={() => onDelete(article.id)} className="w-1/3 flex items-center justify-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white transition-colors hover:bg-red-600 active:scale-95">
                                    <TrashIcon className="w-4 h-4" /> 削除
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen font-inter">
            <header className="mb-10 flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    CMS ダッシュボード
                </h2>
                {!loggedIn ? (
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md">
                        <input
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="管理者キー"
                            type="password"
                            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        />
                        <button
                            onClick={handleLogin}
                            className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-all active:scale-95 text-sm"
                        >
                            ログイン
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            <CloudArrowUpIcon className="w-5 h-5" /> 記事データのエクスポート
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 px-4 py-2 rounded-full bg-red-600 text-white font-semibold text-sm shadow-md hover:bg-red-700 transition-all active:scale-95"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" /> ログアウト
                        </button>
                    </div>
                )}
            </header>

            {!loggedIn ? (
                <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl text-center border-t-4 border-purple-500">
                    <Shield className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                    <p className="text-xl font-bold dark:text-white mb-3">管理者アクセスが必要です</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        記事の作成・編集を行うには、管理キーを入力してログインしてください。
                    </p>
                    <div className="flex flex-col gap-4">
                        <input
                            type="password"
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="管理キーを入力"
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleLogin}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            ログイン
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* 記事作成・編集フォーム (左側 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold dark:text-white mb-6">
                                {editingId ? '記事を編集中' : '新しい記事を作成'}
                            </h3>

                            <div className="space-y-4">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="記事のタイトル"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 outline-none dark:text-white text-lg font-semibold focus:border-purple-500 transition-all"
                                />

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:border-purple-500 transition-all w-full sm:w-auto"
                                    />
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:border-purple-500 transition-all w-full sm:flex-1"
                                    >
                                        <option value="info">お知らせ</option>
                                        <option value="request">お願い</option>
                                        <option value="maintenance">メンテナンス</option>
                                        <option value="explanation">解説</option>
                                        <option value="recruitment">募集</option>
                                    </select>
                                </div>

                                <textarea
                                    value={md}
                                    onChange={(e) => setMd(e.target.value)}
                                    rows={15}
                                    placeholder="Markdownで記事を記述してください。画像は外部のURLで挿入してください: ![alt text](https://external.image/url.jpg)"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:border-purple-500 transition-all font-mono text-sm resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:-translate-y-1 text-lg"
                                >
                                    <CloudArrowUpIcon className="w-6 h-6" />
                                    {editingId ? '変更を保存' : '公開'}
                                </button>
                                <button
                                    onClick={clearForm}
                                    className="px-8 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                                >
                                    クリア
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 記事一覧 (右側 1/3) & コメント管理 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold dark:text-white mb-6">
                                保存済み記事 ({articles.length})
                            </h3>

                            {loading ? (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">読み込み中...</div>
                            ) : (
                                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                                    {articles.map((a) => (
                                        <ArticleCard
                                            key={a.id}
                                            article={a}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            isDeleting={deletingId === a.id}
                                        />
                                    ))}
                                    {articles.length === 0 && (
                                        <div className="text-gray-500 dark:text-gray-400 text-center py-4">記事がありません。</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2">
                                <MessageSquare className="text-purple-500" size={20} /> コメント管理
                            </h3>
                            {commentsLoading ? (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400">コメントを読み込み中...</div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400">コメントはまだありません。</div>
                            ) : (
                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                                    {comments.map((c) => {
                                        const articleTitle = articles.find((a) => a.id === c.articleId)?.title || `記事ID: ${c.articleId}`;
                                        const isReply = !!c.parentId;
                                        const isTargetDeleting = deletingCommentId === c.id;
                                        return (
                                            <div key={c.id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-3 text-xs bg-gray-50 dark:bg-gray-900/60">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                                        {c.name || (L.forum?.anonymous || '名無しさん')}
                                                        {isReply && (
                                                            <span className="ml-1 text-[10px] text-gray-400">(返信)</span>
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-800 dark:text-gray-200 mb-1 line-clamp-3 whitespace-pre-wrap">
                                                    {c.text}
                                                </p>
                                                <p className="text-[10px] text-gray-500 mb-2">
                                                    対象記事: {articleTitle}
                                                </p>
                                                <div className="flex justify-end gap-2">
                                                    {isTargetDeleting ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={confirmDeleteComment}
                                                                className="px-3 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold flex items-center gap-1"
                                                            >
                                                                <CheckCircleIcon className="w-3 h-3" /> 本当に削除
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingCommentId(null)}
                                                                className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-[11px] text-gray-700 dark:text-gray-200"
                                                            >
                                                                キャンセル
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteComment(c.id)}
                                                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-[11px] font-bold flex items-center gap-1"
                                                        >
                                                            <TrashIcon className="w-3 h-3" /> 削除
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const SearchResultsPage = ({ L, searchTerm, navigate }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(true);
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Using simple useEffect to aggregate results allows async Firestore call
    useEffect(() => {
        const fetchResults = async () => {
            setIsSearching(true);
            const results = [];

            // 1. Static Content (News, Commands, Guide, Terms)
            // Search in news
            const newsData = L.news.default_data || [];
            newsData.forEach(item => {
                if (item.title.toLowerCase().includes(lowerSearchTerm) || item.content.toLowerCase().includes(lowerSearchTerm)) {
                    results.push({
                        id: `news-${item.id}`,
                        category: L.footer.search_category_news,
                        title: item.title,
                        description: item.content.substring(0, 100) + '...',
                        action: () => navigate('news') // Could navigate to specific news if updated
                    });
                }
            });

            // Search in commands
            const commands = L.commands.sections || [];
            commands.forEach(section => {
                section.commands?.forEach(cmd => {
                    if (cmd.cmd.toLowerCase().includes(lowerSearchTerm) || cmd.desc.toLowerCase().includes(lowerSearchTerm)) {
                        results.push({
                            id: `cmd-${cmd.cmd}`,
                            category: L.footer.search_category_command,
                            title: cmd.cmd,
                            description: cmd.desc,
                            action: () => navigate('commands')
                        });
                    }
                });
            });

            // Search in FAQ
            const faqs = L.guide.faq_data || [];
            faqs.forEach((faq, i) => {
                if (faq.q.toLowerCase().includes(lowerSearchTerm) || faq.a.toLowerCase().includes(lowerSearchTerm)) {
                    results.push({
                        id: `faq-${i}`,
                        category: L.footer.search_category_guide,
                        title: faq.q,
                        description: faq.a.substring(0, 100) + '...',
                        action: () => navigate('guide')
                    });
                }
            });

            // Search in terms and privacy
            const termsChapters = L.terms?.chapters || [];
            termsChapters.forEach((chapter, idx) => {
                if (chapter.title.toLowerCase().includes(lowerSearchTerm)) {
                    results.push({
                        id: `terms-${idx}`,
                        category: L.footer.search_category_terms,
                        title: chapter.title,
                        description: chapter.articles?.[0]?.content?.substring(0, 100) || '',
                        action: () => navigate('terms')
                    });
                }
            });

            if (L.privacy?.title?.toLowerCase().includes(lowerSearchTerm)) {
                results.push({
                    id: 'privacy',
                    category: L.footer.search_category_privacy,
                    title: L.privacy.title,
                    description: L.privacy.intro?.substring(0, 100) || '',
                    action: () => navigate('privacy')
                });
            }

            // 2. Firestore Articles & Profiles (Async)
            const db = getFirestore();

            try {
                // --- Articles ---
                const articlesQuery = query(collection(db, 'articles'), limit(20));
                const articlesSnapshot = await getDocs(articlesQuery);

                articlesSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.title?.toLowerCase().includes(lowerSearchTerm) || data.md?.toLowerCase().includes(lowerSearchTerm)) {
                        results.push({
                            id: `art-${doc.id}`,
                            category: L.nav.articles || 'Articles',
                            title: data.title,
                            description: (data.md || '').substring(0, 100) + '...',
                            action: () => navigate(`articles/${doc.id}`)
                        });
                    }
                });

                // --- User Profiles ---
                try {
                    const profilesSnapshot = await getDocs(collection(db, 'profiles'));

                    profilesSnapshot.forEach((doc) => {
                        const data = doc.data();
                        const name = (data.name || '').toLowerCase();
                        const gamerTag = (data.gamerTag || '').toLowerCase();

                        if (!name && !gamerTag) return;

                        if (name.includes(lowerSearchTerm) || gamerTag.includes(lowerSearchTerm)) {
                            const displayName = data.name || 'No Name';
                            const displayTag = data.gamerTag ? `@${data.gamerTag}` : '';

                            results.push({
                                id: `user-${doc.id}`,
                                category: L.footer.search_category_user || 'User',
                                title: displayName,
                                description: displayTag || (data.bio || '').substring(0, 80),
                                action: () => navigate(`user/${doc.id}`)
                            });
                        }
                    });
                } catch (e) {
                    console.log('Search profiles error (silent):', e);
                }
            } catch (e) {
                console.log("Search Firestore error (silent):", e);
            }

            setSearchResults(results);
            setIsSearching(false);
        };

        const timeout = setTimeout(fetchResults, 300); // 300ms debounce
        return () => clearTimeout(timeout);
    }, [searchTerm, L, navigate, lowerSearchTerm]);


    return (
        <div className="space-y-6">
            {searchResults.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">{L.footer.search_no_results(searchTerm)}</p>
                </div>
            ) : (
                <>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">{L.footer.search_found(searchResults.length)}</p>
                    {searchResults.map((result) => (
                        <div
                            key={result.id}
                            onClick={result.action}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start gap-4 mb-3">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${result.category === L.footer.search_category_news ? 'bg-blue-50 text-blue-600 border-blue-100' : result.category === L.footer.search_category_terms ? 'bg-red-50 text-red-600 border-red-100' : result.category === L.footer.search_category_privacy ? 'bg-green-50 text-green-600 border-green-100' : 'bg-purple-100 text-purple-600 border-purple-100'}`}>{result.category}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{result.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{result.description}</p>
                            <div className="text-purple-500 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-auto">Read More <ArrowRight size={14} /></div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};


export const JoinPage = ({ L, serverStatus, handleCopy, navigate }) => (
    <div className="pt-24"><JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} /></div>
);


// ==========================================
// 5. Profile Pages
// ==========================================

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

const ProfilePage = ({ L, user, profile, db, page, navigate }) => {
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
                if (page && page.startsWith && page.startsWith('user/')) {
                    const parts = page.split('/');
                    if (parts[1]) targetUid = parts[1];
                }

                if (targetUid === user.uid && profile) {
                    setTargetProfile(profile);
                    return;
                }

                const ref = doc(db, 'profiles', targetUid);
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    setError(L?.profile?.not_found || 'プロフィールが見つかりません');
                    return;
                }
                setTargetProfile(snap.data());
                
                // フォロー状態を確認
                if (user.uid !== targetUid) {
                    const followRef = doc(db, 'follows', `${user.uid}_${targetUid}`);
                    const followSnap = await getDoc(followRef);
                    setIsFollowing(followSnap.exists());
                }
                
                // フォロワー/フォロー中数を取得
                const followersSnap = await getCountFromServer(collection(db, 'follows', 'followerCounts', targetUid));
                const followingSnap = await getCountFromServer(collection(db, 'follows', 'followingCounts', targetUid));
                setFollowersCount(followersSnap.data().count || 0);
                setFollowingCount(followingSnap.data().count || 0);
                
            } catch (e) {
                console.error('Failed to load profile page', e);
                setError('プロフィールの読み込みに失敗しました');
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        setError(null);
        setTargetProfile(null);
        load();
    }, [db, user, profile, page, L]);

    // ユーザー投稿タイムライン
    useEffect(() => {
        if (!db || !user) {
            setPosts([]);
            setPostsLoading(false);
            return;
        }

        let targetUid = user.uid;
        if (page && page.startsWith && page.startsWith('user/')) {
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

    const isOwnProfile = user && targetProfile && user.uid === (page && page.startsWith('user/') ? page.split('/')[1] || user.uid : user.uid);

    const handleFollow = async () => {
        if (!db || !user || user.isAnonymous || !targetProfile) return;
        
        try {
            const targetUid = page && page.startsWith('user/') ? page.split('/')[1] : user.uid;
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
                authorName: profile?.name || 'Unknown',
                authorAvatar: profile?.iconUrl || '',
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
                authorName: profile?.name || 'Unknown',
                authorAvatar: profile?.iconUrl || '',
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
                        fromUserName: profile?.name || 'Unknown',
                        toUserId: post.authorUid,
                        postId,
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
            
            // 投稿一覧を更新
            setPosts(prev => prev.map(p => 
                p.id === postId 
                    ? { ...p, likes: likeSnap.exists() ? (p.likes || 1) - 1 : (p.likes || 0) + 1 } 
                    : p
            ));
            
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

    // ソーシャルメディアアイコン
    const socialIcons = {
        twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
        youtube: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg',
        twitch: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitch.svg',
        github: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg',
        instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg',
        facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
    };

    return (
        <div className="max-w-4xl mx-auto pb-16">
            {/* バナー画像 */}
            <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden">
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
                                onClick={() => navigate('profile/edit')}
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
                                className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 transition-colors ${
                                    isFollowing 
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
                                a: ({node, ...props}) => (
                                    <a 
                                        {...props} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-purple-600 dark:text-purple-400 hover:underline"
                                    />
                                ),
                                code: ({node, inline, ...props}) => (
                                    <code 
                                        {...props} 
                                        className={`${
                                            inline 
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
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>最終ログイン: {formatTimestamp(targetProfile.lastLoginAt) || '不明'}</span>
                    </div>
                </div>
                
                {/* フォロー/フォロワー */}
                <div className="flex space-x-6 mb-6">
                    <button 
                        className="hover:underline"
                        onClick={() => navigate(`/user/${page?.split('/')[1]}/following`)}
                    >
                        <span className="font-bold text-gray-900 dark:text-white">{followingCount}</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">フォロー中</span>
                    </button>
                    <button 
                        className="hover:underline"
                        onClick={() => navigate(`/user/${page?.split('/')[1]}/followers`)}
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

            {/* Twitter風タイムライン */}
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

const ProfileEditPage = ({ L, user, profile, db, showToast }) => {
    const [form, setForm] = useState({
        name: profile?.name || '',
        bio: profile?.bio || '',
        gamerTag: profile?.gamerTag || '',
        location: profile?.location || '',
        links: profile?.links || '',
        bannerUrl: profile?.bannerUrl || '',
        iconUrl: profile?.iconUrl || '',
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({ banner: false, icon: false });
    const [preview, setPreview] = useState({
        banner: profile?.bannerUrl || '',
        icon: profile?.iconUrl || '',
    });
    const [socialLinks, setSocialLinks] = useState(profile?.socialLinks || [
        { platform: 'twitter', url: '' },
        { platform: 'youtube', url: '' },
        { platform: 'twitch', url: '' },
    ]);

    if (!user || user.isAnonymous) {
        return <div className="max-w-3xl mx-auto py-32 px-4 text-center">プロフィールを編集するにはログインしてください。</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialLinkChange = (index, field, value) => {
        const newLinks = [...socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setSocialLinks(newLinks);
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return null;
        
        setUploading(prev => ({ ...prev, [type]: true }));
        
        try {
            // In a real app, upload to Supabase Storage here
            // For now, we'll just create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(prev => ({ ...prev, [type]: previewUrl }));
            
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, return the uploaded file URL
            return previewUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            showToast && showToast('画像のアップロードに失敗しました');
            return null;
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const url = await handleFileUpload(file, 'banner');
        if (url) {
            setForm(prev => ({ ...prev, bannerUrl: url }));
        }
    };

    const handleIconChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const url = await handleFileUpload(file, 'icon');
        if (url) {
            setForm(prev => ({ ...prev, iconUrl: url }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!db) return;
        setSaving(true);
        try {
            const ref = doc(db, 'profiles', user.uid);
            await fsUpdateDoc(ref, {
                name: form.name || 'No Name',
                bio: form.bio || '',
                gamerTag: form.gamerTag || '',
                location: form.location || '',
                links: form.links || '',
                bannerUrl: form.bannerUrl || '',
                iconUrl: form.iconUrl || '',
                socialLinks: socialLinks.filter(link => link.url),
                lastLoginAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            showToast && showToast('プロフィールを保存しました');
        } catch (e) {
            console.error('Failed to save profile', e);
            showToast && showToast('プロフィールの保存に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    const socialIcons = {
        twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
        youtube: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg',
        twitch: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitch.svg',
        github: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg',
        instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg',
        facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in-scale">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Banner Upload */}
                <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600">
                    {preview.banner ? (
                        <img 
                            src={preview.banner} 
                            alt="Banner" 
                            className="w-full h-full object-cover"
                        />
                    ) : null}
                    <label className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleBannerChange}
                            disabled={uploading.banner}
                        />
                        {uploading.banner ? (
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </label>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Profile Picture Upload */}
                    <div className="absolute -top-16 left-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-purple-400 to-indigo-500 overflow-hidden">
                                {preview.icon ? (
                                    <img 
                                        src={preview.icon} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                                        {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleIconChange}
                                    disabled={uploading.icon}
                                />
                                {uploading.icon ? (
                                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="pt-20 space-y-6">
                        <h2 className="text-2xl font-black dark:text-white">プロフィールを編集</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-200">表示名</label>
                                <input 
                                    name="name" 
                                    value={form.name} 
                                    onChange={handleChange} 
                                    placeholder="ユーザー名"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-200">ゲーマータグ</label>
                                <input 
                                    name="gamerTag" 
                                    value={form.gamerTag} 
                                    onChange={handleChange} 
                                    placeholder="例: Player123"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-200">自己紹介 (Markdown対応)</label>
                            <textarea 
                                name="bio" 
                                value={form.bio} 
                                onChange={handleChange} 
                                rows="4" 
                                placeholder="自己紹介を入力してください。マークダウンが使用できます。"
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm" 
                            />
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                マークダウン記法が使用できます。例: **太字**、*斜体*、[リンク](https://example.com)
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-200">場所</label>
                            <input 
                                name="location" 
                                value={form.location} 
                                onChange={handleChange} 
                                placeholder="例: 東京都渋谷区"
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-200">ウェブサイト</label>
                            <input 
                                name="links" 
                                value={form.links} 
                                onChange={handleChange} 
                                placeholder="https://example.com"
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 dark:text-gray-200">ソーシャルリンク</label>
                            <div className="space-y-3">
                                {socialLinks.map((link, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                            <img 
                                                src={socialIcons[link.platform] || socialIcons.twitter} 
                                                alt={link.platform} 
                                                className="w-5 h-5"
                                            />
                                        </div>
                                        <select
                                            value={link.platform}
                                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="twitter">Twitter / X</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="twitch">Twitch</option>
                                            <option value="github">GitHub</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                            placeholder="https://"
                                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-colors flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        保存中...
                                    </>
                                ) : '変更を保存'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};


// ==========================================
// 6. Home Page (Home.jsx)
// ==========================================

export const HomePage = ({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion, showToast, newsData, hasUnreadNews }) => {
    const QUIZ_DATA = L.quiz_data;
    const latestNews = newsData && newsData.length > 0 ? newsData.slice(0, 3) : L.news.default_data;

    // Contact Form Logic (Enhanced with validation)


    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            subject: 'Contact Form Submission'
        };

        if (showToast) showToast('送信中...', 'info');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok && result.success) {
                if (showToast) showToast('送信しました。', 'success');
                e.target.reset();
            } else {
                throw new Error(result.message || '送信に失敗しました');
            }
        } catch (error) {
            console.error('Contact Error:', error);
            if (showToast) showToast('エラーが発生しました。時間を置く再試行してください。', 'error');
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <header className="relative h-screen min-h-[700px] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1607016284345-c5478694085f?q=80&w=2070&auto=format&fit=crop" alt="Minecraft Landscape" className="w-full h-full object-cover transform scale-105 animate-float" style={{ animationDuration: '20s' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/banner.jpg"; }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {serverStatus.loading ? L.status.loading : serverStatus.online ? L.status.online(serverStatus.players) : L.status.offline}
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl whitespace-pre-line animate-fade-in-up transition-all duration-700 tracking-tight">
                        {L.home.hero_title.split('\n')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 animate-pulse">{L.home.hero_title.split('\n')[1]}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium whitespace-pre-line leading-relaxed animate-fade-in-up drop-shadow-md" style={{ animationDelay: '200ms' }}>{L.home.hero_subtitle}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button onClick={() => scrollToSection('join')} className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xl font-black rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-3"><Gamepad2 size={28} />{L.home.join_now}</span>
                            <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                        </button>
                        <button onClick={() => scrollToSection('about')} className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl font-bold rounded-full transition-all flex items-center gap-3 hover:scale-105">
                            <HelpCircle size={28} />{L.home.see_details}
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="relative z-20 -mt-24 max-w-6xl mx-auto px-4">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 p-10 grid grid-cols-2 md:grid-cols-4 gap-8 hover:transform hover:-translate-y-1 transition-transform duration-500">
                    {[
                        { val: "150+", label: L.home.stat_cumulative_players, icon: Users, color: "text-blue-500" },
                        { val: "70%", label: L.home.stat_retention_rate, icon: CheckCircle, color: "text-green-500" },
                        { val: "99.9%", label: L.home.stat_uptime, icon: Server, color: "text-purple-500" },
                        { val: "15+", label: L.home.stat_max_online, icon: Zap, color: "text-yellow-500" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <stat.icon className={`${stat.color} mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`} size={36} />
                            <div className="text-4xl font-black text-gray-800 dark:text-white mb-2">{stat.val}</div>
                            <div className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest News Section (New) */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-black mb-2 dark:text-white">{L.home.latest_news_title || "最新のお知らせ"}</h2>
                            <div className="h-1.5 w-20 bg-purple-500 rounded-full"></div>
                        </div>
                        <button onClick={() => navigate('news')} className="hidden md:flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
                            {L.home.see_news} <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {latestNews.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer" onClick={() => navigate('news')}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${item.type === 'maintenance' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{item.type === 'maintenance' ? L.news.maintenance : L.news.info}</span>
                                    <span className="text-xs text-gray-400 font-bold">{item.date}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-3 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{item.content}</p>
                                <div className="text-purple-500 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-auto">Read More <ArrowRight size={14} /></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('news')} className="md:hidden w-full mt-6 py-4 bg-white dark:bg-gray-800 text-purple-600 font-bold rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-center items-center gap-2">
                        {L.home.see_news} <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative z-10 order-2 md:order-1">
                            <div className="inline-block p-4 rounded-3xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-8"><Server size={40} /></div>
                            <h2 className="text-5xl font-black mb-8 dark:text-white leading-tight">{L.home.what_is_nantetsu}</h2>
                            <div className="space-y-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-l-8 border-purple-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} className="text-purple-500" /></div>
                                    <strong className="text-purple-600 dark:text-purple-400 block text-2xl font-black mb-4">{L.home.description_p1}</strong>
                                    {L.home.description_p2}
                                </div>
                                <p className="text-xl">{L.home.description_p3}</p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 relative">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
                                <img src="https://github.com/NANTETU/Nantetu-Server/blob/main/images/867244da-775d-4a50-8d80-41b3ba7b7dcb.jpg?raw=true" alt="Server Community" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="absolute inset-0 bg-purple-600 rounded-[3rem] rotate-6 opacity-20 scale-95 blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-gray-900 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-20 inline-block relative text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">{L.home.stats_title}</span>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-purple-500 rounded-full"></div>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        <FeatureCard icon={Shield} title={L.home.feature_p1_title} description={L.home.feature_p1_desc} bgClass="bg-orange-500" colorClass="text-orange-500" />
                        <FeatureCard icon={Clock} title={L.home.feature_p2_title} description={L.home.feature_p2_desc} bgClass="bg-green-500" colorClass="text-green-500" />
                        <FeatureCard icon={MessageCircle} title={L.home.feature_p3_title} description={L.home.feature_p3_desc} bgClass="bg-indigo-500" colorClass="text-indigo-500" />
                        <FeatureCard icon={Terminal} title={L.home.feature_p4_title} description={L.home.feature_p4_desc} bgClass="bg-lime-600" colorClass="text-lime-600" onClick={() => navigate('commands')} />
                        <FeatureCard icon={Server} title={L.home.feature_p5_title} description={L.home.feature_p5_desc} bgClass="bg-yellow-500" colorClass="text-yellow-500" />
                        <FeatureCard icon={BookOpen} title={L.home.feature_p6_title} description={L.home.feature_p6_desc} bgClass="bg-pink-500" colorClass="text-pink-500" onClick={() => navigate('guide')} />
                    </div>
                </div>
            </section>

            <JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />

            {/* Rules & Quiz */}
            <section id="rules" className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4 dark:text-white">{L.home.rules_title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{L.home.rules_subtitle}</p>
                    </div>
                    <div className="mb-20 space-y-6">
                        {L.rules_data.map((rule, idx) => (
                            <AccordionItem key={idx} title={rule.title} content={rule.content} isOpen={activeAccordion === `rules-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `rules-${idx}` ? null : `rules-${idx}`)} />
                        ))}
                    </div>

                    {/* Quiz UI Block */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 md:p-16 border border-purple-100 dark:border-gray-700 relative overflow-hidden text-center group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

                        {!quizState.started ? (
                            <div className="animate-fade-in relative z-10">
                                <div className="inline-block p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6"><Sparkles size={32} /></div>
                                <h3 className="text-3xl font-black mb-6 dark:text-white">{L.home.quiz_title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg max-w-2xl mx-auto">{L.home.quiz_subtitle}</p>
                                <button onClick={() => setQuizState({ ...quizState, started: true })} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-2 mx-auto">
                                    {L.home.quiz_start} <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in relative z-10">
                                {quizState.finished ? (
                                    <div className="animate-fade-in-up">
                                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle size={48} className="text-green-500" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-2 dark:text-white">{L.home.quiz_done}</h3>
                                        <p className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{L.home.quiz_score(quizState.score, QUIZ_DATA.length)}</p>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-8 border border-gray-100 dark:border-gray-700">
                                            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                                {quizState.score === QUIZ_DATA.length ? L.home.quiz_result_perfect : L.home.quiz_result_retry}
                                            </p>
                                        </div>
                                        <button onClick={resetQuiz} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-1">{L.home.quiz_retry}</button>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto">
                                        <div className="flex justify-between items-center mb-8">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question {quizState.current + 1} / {QUIZ_DATA.length}</span>
                                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">Score: {quizState.score}</span>
                                        </div>
                                        <h4 className="text-2xl font-bold mb-10 dark:text-white leading-relaxed">{QUIZ_DATA[quizState.current].question}</h4>
                                        <div className="grid gap-4">
                                            {QUIZ_DATA[quizState.current].options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => !quizState.showResult && handleQuizAnswer(opt)}
                                                    disabled={quizState.showResult}
                                                    className={`w-full p-6 rounded-2xl text-left font-bold border-2 transition-all relative overflow-hidden ${quizState.showResult
                                                        ? opt === QUIZ_DATA[quizState.current].answer
                                                            ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                                                            : "opacity-50 border-transparent bg-gray-50 dark:bg-gray-800"
                                                        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg hover:-translate-y-0.5"
                                                        }`}
                                                >
                                                    <span className="relative z-10 flex justify-between items-center">
                                                        {opt}
                                                        {quizState.showResult && opt === QUIZ_DATA[quizState.current].answer && <CheckCircle className="text-green-500" />}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {quizState.showResult && (
                                            <div className={`mt-6 font-bold text-lg animate-fade-in-up ${quizState.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                                {quizState.isCorrect ? L.home.quiz_correct : L.home.quiz_incorrect}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 px-4">
                <div className="max-w-2xl mx-auto relative">
                    <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 relative z-10">
                        <h2 className="text-3xl font-black mb-8 text-center dark:text-white">{L.home.contact_title}</h2>
                        <form className="space-y-6" onSubmit={handleContactSubmit}>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_name}</label>
                                <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="name" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact_placeholder_name} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_email}</label>
                                <div className="relative"><MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact_placeholder_email} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_message}</label>
                                <textarea name="message" rows="5" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact_placeholder_msg} required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1"><Send size={20} />{L.home.contact_send}</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ==========================================
// 6. Main App Component (App.jsx)
// ==========================================

const CustomStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
    :root { --font-sans: 'Noto Sans JP', sans-serif; }
    body { font-family: var(--font-sans); }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeInUps { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes progress { 0% { width: 0%; margin-left: 0; } 50% { width: 70%; margin-left: 0; } 100% { width: 100%; margin-left: 0; } }
    @keyframes shine { 100% { left: 125%; } }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-progress { animation: progress 1.5s ease-in-out infinite; }
    .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUps 0.6s ease-out forwards; }
    .animate-fade-out { animation: fadeOut 0.5s ease-out forwards 1.5s; /* Delay 1.5s then fade */ }
    .animate-shine { animation: shine 1s; }
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    .glass-panel { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.5); }
    .dark .glass-panel { background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); }
  `}</style>
);

export default function App() {

    // State Definitions
    const [darkMode, setDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [page, setPage] = useState('home');
    const [serverStatus, setServerStatus] = useState({ online: false, players: 0, loading: true });
    const [quizState, setQuizState] = useState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('ja');

    // Localization
    const L = LANGUAGES[currentLang];

    // Search State
    const [searchTerm, setSearchTerm] = useState(''); // Debounced
    const [searchValue, setSearchValue] = useState(''); // Immediate Input
    const searchTimeoutRef = useRef(null);

    // Debounced search handler for navbar search box
    const handleSearch = useCallback((e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(value);
        }, 500);
    }, []);

    // Initial Loading
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);

    // Data
    const [newsData, setNewsData] = useState([]);
    const [hasUnreadNews, setHasUnreadNews] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = useCallback((msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    // Firebase
    const [user, setUser] = useState(null);
    const [db, setDb] = useState(null);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    // User Profile
    const [profile, setProfile] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    const handleGeminiCall = useCallback(async (userPrompt) => {
        const apiEndpoint = '/api/generate';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userPrompt }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("Gemini Result:", data.result);
            return data.result;

        } catch (error) {
            console.error("API Call Error:", error);
        }
    }, []);

    // --- Initialize Firebase & Auth Listener ---
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Use the already initialized app and auth from firebase.js
                const firestore = getFirestore(app);
                setDb(firestore);

                onAuthStateChanged(auth, async (u) => {
                    if (u) {
                        setUser(u);
                        return;
                    }

                    try {
                        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                            await signInWithCustomToken(auth, __initial_auth_token);
                        } else {
                            await signInAnonymously(auth);
                        }
                    } catch (e) {
                        console.error('Fallback auth failed:', e);
                    }
                });
            } catch (e) {
                console.error('Firebase init failed:', e);
            }
        };

        initAuth();
    }, []);

    const isGoogleUser = user && !user.isAnonymous;

    // --- Load or Create User Profile ---
    useEffect(() => {
        const loadProfile = async () => {
            if (!db || !user || user.isAnonymous) {
                setProfile(null);
                return;
            }

            setIsProfileLoading(true);
            try {
                const profileRef = doc(db, 'profiles', user.uid);
                const snap = await getDoc(profileRef);

                if (snap.exists()) {
                    const data = snap.data();
                    setProfile(data);
                    await fsUpdateDoc(profileRef, {
                        lastLoginAt: serverTimestamp(),
                    });
                } else {
                    const initialProfile = {
                        name: user.displayName || 'No Name',
                        bio: '',
                        gamerTag: '',
                        location: '',
                        links: '',
                        createdAt: serverTimestamp(),
                        lastLoginAt: serverTimestamp(),
                    };
                    await setDoc(profileRef, initialProfile);
                    setProfile(initialProfile);
                }
            } catch (e) {
                console.error('Failed to load profile', e);
            } finally {
                setIsProfileLoading(false);
            }
        };

        loadProfile();
    }, [db, user]);

    const handleGoogleLogin = useCallback(async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
        } catch (e) {
            console.error('Google login failed', e);
            showToast('Googleログインに失敗しました');
        }
    }, [auth]);

    const handleUserLogout = useCallback(async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            setProfile(null);
        } catch (e) {
            console.error('Logout failed', e);
            showToast('ログアウトに失敗しました');
        }
    }, []);

    // Enhanced dark mode management with localStorage persistence
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
            const isDark = JSON.parse(savedDarkMode);
            setDarkMode(isDark);
            if (isDark) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
            if (prefersDark) document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, [darkMode]);

    // Initial Splash Screen Timer
    useEffect(() => {
        const timer = setTimeout(() => setIsAppLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // --- Router Logic (Hash Router) ---
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/', '') || 'home';
            setPage(hash);
        };

        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Enhanced Navigation with Loading Bar & Routing (Memoized)
    const handleNavigate = useCallback((targetPage, sectionId = null) => {
        if (targetPage === page && !sectionId) return;

        setSearchTerm('');
        setSearchValue('');

        setIsPageLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        window.location.hash = `/${targetPage}`;

        setTimeout(() => {
            setIsPageLoading(false);
            if (sectionId) {
                setTimeout(() => {
                    const element = document.getElementById(sectionId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }, 400);
    }, [page]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`https://api.mcsrvstat.us/bedrock/2/${L.server.ip}:${L.server.port}`);
                const data = await res.json();
                setServerStatus({ online: data.online, players: data.online ? data.players.online : 0, loading: false });
            } catch {
                setServerStatus({ online: false, players: 0, loading: false });
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 60000);

        const fetchNews = async () => {
            try {
                const res = await fetch(NEWS_SHEET_URL);
                if (res.ok) {
                    const text = await res.text();
                    const startRaw = text.indexOf('(');
                    const endRaw = text.lastIndexOf(')');
                    if (startRaw === -1 || endRaw === -1) throw new Error('Invalid format');

                    let jsonString = text.substring(startRaw + 1, endRaw);
                    jsonString = jsonString.replace(/new Date\((.*?)\)/g, '"Date($1)"');

                    const json = JSON.parse(jsonString);
                    if (json.table?.rows) {
                        const parsed = json.table.rows.map((row, i) => {
                            let rawDate = row.c[0]?.v;
                            let dateStr = rawDate;

                            if (typeof rawDate === 'string' && rawDate.startsWith('Date(')) {
                                const parts = rawDate.match(/\d+/g);
                                if (parts && parts.length >= 3) {
                                    const y = parseInt(parts[0]);
                                    const m = parseInt(parts[1]) + 1;
                                    const d = parseInt(parts[2]);
                                    dateStr = `${y}.${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`;
                                }
                            } else if (typeof rawDate === 'number') {
                                const excelEpoch = new Date(1899, 11, 30);
                                const dateObj = new Date(excelEpoch.getTime() + rawDate * 86400000);
                                dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
                            } else {
                                try {
                                    const d = new Date(rawDate);
                                    if (!isNaN(d.getTime())) {
                                        dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
                                    } else {
                                        dateStr = String(rawDate);
                                    }
                                } catch {
                                    dateStr = String(rawDate);
                                }
                            }

                            return {
                                id: i + 100,
                                date: dateStr,
                                title: row.c[1]?.v || '',
                                content: row.c[2]?.v || '',
                                url: row.c[3]?.v,
                                type: (() => {
                                    const c = row.c[2]?.v || '';
                                    if (c.includes('メンチンス')) return 'maintenance';
                                    if (c.includes('お願い')) return 'request';
                                    if (c.includes('解説')) return 'explanation';
                                    if (c.includes('募集')) return 'recruitment';
                                    if (c.includes('その他')) return 'other';
                                    return 'info';
                                })(),
                            };
                        }).filter((i) => i.title);
                        setNewsData(parsed.sort((a, b) => b.date.localeCompare(a.date)));
                    }
                }
            } catch (e) {
                console.error('News fetch error', e);
                showToast('ニュースの取得に失敗しました');
            }
        };
        fetchNews();
        return () => clearInterval(interval);
    }, []);

    const handleCopy = useCallback((text) => {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy:', err);
            showToast('コピーに失敗しました');
        });
    }, [showToast]);

    // ... rest of the code remains the same ...
    const scrollToSection = useCallback((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const resetQuiz = useCallback(() => setQuizState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null }), []);

    // Handle Quiz (Memoized with error handling)
    const handleQuizAnswer = useCallback((selectedOption) => {
        try {
            if (!L || !L.quiz_data || !L.quiz_data[quizState.current]) return;

            const isCorrect = selectedOption === L.quiz_data[quizState.current].answer;
            setQuizState(prev => ({ ...prev, showResult: true, isCorrect }));

            setTimeout(() => {
                if (isCorrect) {
                    setQuizState(prev => {
                        const nextIdx = prev.current + 1;
                        if (nextIdx < L.quiz_data.length) {
                            return { ...prev, current: nextIdx, score: prev.score + 1, showResult: false, isCorrect: null };
                        } else {
                            return { ...prev, score: prev.score + 1, finished: true, showResult: false };
                        }
                    });
                } else {
                    setQuizState(prev => {
                        const nextIdx = prev.current + 1;
                        if (nextIdx < L.quiz_data.length) {
                            return { ...prev, current: nextIdx, showResult: false, isCorrect: null };
                        } else {
                            return { ...prev, finished: true, showResult: false };
                        }
                    });
                }
            }, 1500);
        } catch (err) {
            console.error('Quiz error:', err);
            showToast('クイズ処琁E��にエラーが発生しました');
        }
    }, [quizState.current, showToast]);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
            <CustomStyles />

            {/* 1. Global Loading Overlays */}
            {isAppLoading && <LoadingScreen />}
            <LoadingBar isLoading={isPageLoading} />

            {/* 2. Navigation */}
            <Navbar
                L={L}
                page={page}
                navigate={handleNavigate}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                currentLang={currentLang}
                setCurrentLang={setCurrentLang}
                searchTerm={searchTerm}
                searchValue={searchValue}
                handleSearch={handleSearch}
                serverStatus={serverStatus}
                hasUnreadNews={hasUnreadNews}
                newsData={newsData}
                user={user}
                profile={profile}
                isProfileLoading={isProfileLoading}
                onLogin={handleGoogleLogin}
                onLogout={handleUserLogout}
            />

            {/* 3. Main Content Router - TEXT COLOR FIX applied here */}
            <main className="relative z-10 min-h-screen text-gray-900 dark:text-gray-100">
                {searchTerm && (
                    <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
                        <h2 className="text-4xl font-black mb-8 dark:text-white">{L.footer.search_results_title}</h2>
                        <SearchResultsPage L={L} searchTerm={searchTerm} navigate={handleNavigate} />
                    </div>
                )}
                {!searchTerm && page === 'home' && (
                    <HomePage
                        L={L}
                        serverStatus={serverStatus}
                        quizState={quizState}
                        setQuizState={setQuizState}
                        resetQuiz={resetQuiz}
                        handleQuizAnswer={handleQuizAnswer}
                        handleCopy={handleCopy}
                        scrollToSection={scrollToSection}
                        navigate={handleNavigate}
                        activeAccordion={activeAccordion}
                        setActiveAccordion={setActiveAccordion}
                        showToast={showToast}
                        newsData={newsData}
                        hasUnreadNews={hasUnreadNews}
                    />
                )}
                {!searchTerm && page === 'news' && <NewsPage L={L} newsData={newsData} />}
                {!searchTerm && page.startsWith && page.startsWith('news/') && (
                    (() => {
                        const id = page.split('/')[1];
                        return <NewsDetail L={L} id={id} newsData={newsData} navigate={handleNavigate} />;
                    })()
                )}
                {!searchTerm && page === 'articles' && <ArticlesPage L={L} db={db} appId={appId} navigate={handleNavigate} />}
                {!searchTerm && page.startsWith && page.startsWith('articles/') && (
                    (() => {
                        const id = page.split('/')[1];
                        return <ArticleDetail L={L} id={id} db={db} appId={appId} navigate={handleNavigate} />;
                    })()
                )}
                {!searchTerm && page === 'forum' && <ForumPage L={L} user={user} db={db} appId={appId} profile={profile} navigate={handleNavigate} />}
                {!searchTerm && page === 'guide' && <GuidePage L={L} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />}
                {!searchTerm && page === 'commands' && <CommandsPage L={L} />}
                {!searchTerm && page === 'terms' && <TermsPage L={L} />}
                {!searchTerm && page === 'privacy' && <PrivacyPage L={L} />}
                {!searchTerm && page === 'join' && <JoinPage L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={handleNavigate} />}
                {!searchTerm && page === 'admin' && <AdminPage L={L} db={db} user={user} appId={appId} showToast={showToast} />}
                {!searchTerm && (page === 'user' || (page.startsWith && page.startsWith('user/'))) && (
                    <ProfilePage L={L} user={user} profile={profile} db={db} page={page} />
                )}
                {!searchTerm && page === 'user-edit' && (
                    <ProfileEditPage L={L} user={user} profile={profile} db={db} showToast={showToast} />
                )}
                {!searchTerm && !['home', 'news', 'articles', 'forum', 'guide', 'commands', 'terms', 'privacy', 'join', 'admin', 'user', 'user-edit'].includes(page) && !page.startsWith('articles/') && !page.startsWith('news/') && !(page.startsWith && page.startsWith('user/')) && <NotFoundPage L={L} navigate={handleNavigate} />}
            </main>

            {/* 4. Footer */}
            <Footer L={L} navigate={handleNavigate} />

            {/* 5. Global Overlays */}
            {toastMessage && <Toast message={toastMessage} />}

            {/* Chat Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform hover:shadow-purple-500/50 group"
            >
                <MessageCircle size={28} className="group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            <AIChat L={L} isChatOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} currentLang={currentLang} />
        </div>
    );
}