import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Menu, X, Moon, Sun, Copy, CheckCircle, AlertTriangle, AlertCircle, Bell,
    Server, Users, Shield, Clock, MessageCircle, MessageSquare, MapPin, User, Link2,
    HelpCircle, ChevronDown, ChevronUp, Gamepad2, Terminal, Zap, ArrowRight, BookOpen,
    Pencil as PencilIcon, Edit3, Trash as TrashIcon, CheckCircle as CheckCircleIcon,
    LogOut as ArrowLeftOnRectangleIcon, UploadCloud as CloudArrowUpIcon,
    Sparkles, Loader2, Send, FileText, Search, ExternalLink, MoreHorizontal, Calendar,
    Heart, Eye
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

import { Navbar, Footer, LoadingScreen, LoadingBar, Toast } from './components';
import {
    ForumPage, GuidePage, CommandsPage, TermsPage, PrivacyPage, JoinPage,
    NotFoundPage, AdminPage, HomePage, NewsPage, NewsDetail,
    ArticlesPage, ArticleDetail, SearchResultsPage
} from './pages';
import { app, auth, firebaseConfig } from './config/firebase';
import { SPREADSHEET_ID, SHEET_GID, NEWS_SHEET_URL, DISCORD_WEBHOOK_URL } from './config/constants';
import { LANGUAGES } from './config/languages';
import { formatCorrectedDate, formatTimestamp } from './utils/helpers';

// ==========================================
// 1. Configuration & Data (languages.js)
// ==========================================

// Firebase and helper functions now imported from config and utils
// (firebaseConfig, app, formatCorrectedDate)

// LANGUAGES object now imported from './config/languages'

// ==========================================
// 2. UI Components (UI.jsx)
// ==========================================

// Components moved to src/components/UI.jsx


// ==========================================
// 3. Layout Components (Layout.jsx)
// ==========================================

// Navbar and Footer are now imported from ./components

// ==========================================
// 3. Sub Pages (SubPages.jsx)
// ==========================================


// News components moved to src/pages/NewsPage.jsx


// Page components moved to src/pages/

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
    .glass-panel { background: rgba(17, 24, 39, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
  `}</style>
);

export default function App() {

    // State Definitions
    // Dark mode is now always enabled
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [page, setPage] = useState('home');
    const [serverStatus, setServerStatus] = useState({ online: false, players: 0, loading: true });
    const [quizState, setQuizState] = useState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });
    const [activeAccordion, setActiveAccordion] = useState(null);
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







    // Set dark mode as default and only theme
    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
    }, []);

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
        <div className="min-h-screen transition-colors duration-300 dark bg-gray-950 text-white">
            <CustomStyles />

            {/* 1. Global Loading Overlays */}
            {isAppLoading && <LoadingScreen />}
            <LoadingBar isLoading={isPageLoading} />

            {/* 2. Navigation */}
            <Navbar
                L={L}
                page={page}
                navigate={handleNavigate}
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
                        <SearchResultsPage L={L} searchTerm={searchTerm} navigate={handleNavigate} newsData={newsData} />
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
                {!searchTerm && page === 'admin' && <AdminPage L={L} db={db} navigate={handleNavigate} />}

                {!searchTerm && !['home', 'news', 'articles', 'forum', 'guide', 'commands', 'terms', 'privacy', 'join', 'admin'].includes(page) && !page.startsWith('articles/') && !page.startsWith('news/') && <NotFoundPage L={L} navigate={handleNavigate} />}
            </main>

            {/* 4. Footer */}
            <Footer L={L} navigate={handleNavigate} />

            {/* 5. Global Overlays */}
            {toastMessage && <Toast message={toastMessage} />}
        </div>
    );
}