import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle, AlertCircle, Bell,
    Server, Users, Shield, Clock, MessageCircle, MessageSquare, MapPin, User, Link2,
    HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal, Zap, ArrowRight, BookOpen,
    Pencil as PencilIcon, Edit3, Trash as TrashIcon, CheckCircle as CheckCircleIcon,
    LogOut as ArrowLeftOnRectangleIcon, UploadCloud as CloudArrowUpIcon,
    Sparkles, Loader2, Send, FileText, Search, ExternalLink, MoreHorizontal, Calendar
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
const ArticleDetail = ({ L, id, db, appId, navigate }) => {
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

    const isGoogleUser = false;

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
                uid: null,
                name: newCommentName.trim() || (L.forum?.anonymous || '名無しさん'),
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
                uid: null,
                name: replyName.trim() || (L.forum?.anonymous || '名無しさん'),
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
    const [db, setDb] = useState(null);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

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

    // --- Initialize Firebase ---
    useEffect(() => {
        const initFirebase = async () => {
            try {
                const firestore = getFirestore(app);
                setDb(firestore);
            } catch (e) {
                console.error('Firebase init failed:', e);
            }
        };

        initFirebase();
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
                {!searchTerm && page === 'forum' && <ForumPage L={L} db={db} appId={appId} navigate={handleNavigate} />}
                {!searchTerm && page === 'guide' && <GuidePage L={L} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />}
                {!searchTerm && page === 'commands' && <CommandsPage L={L} />}
                {!searchTerm && page === 'terms' && <TermsPage L={L} />}
                {!searchTerm && page === 'privacy' && <PrivacyPage L={L} />}
                {!searchTerm && page === 'join' && <JoinPage L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={handleNavigate} />}

                {!searchTerm && !['home', 'news', 'articles', 'forum', 'guide', 'commands', 'terms', 'privacy', 'join'].includes(page) && !page.startsWith('articles/') && !page.startsWith('news/') && <NotFoundPage L={L} navigate={handleNavigate} />}
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