import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Menu, X, CheckCircle, AlertCircle, Trash2, Zap, Send, Bot } from 'lucide-react';
import {
    getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import {
    signInAnonymously, onAuthStateChanged, signInWithCustomToken, getAuth,
    GoogleAuthProvider, signInWithPopup, signOut
} from 'firebase/auth';

import { Navbar, Footer, AIChat, LoadingScreen, LoadingBar, Toast, FeatureCard, CopyBox, AccordionItem, NewsItem } from './components';
import {
    HomePage, NewsPage, NewsDetail, ArticlesPage, ArticleDetail,
    AdminPage, SearchResultsPage, ProfilePage, ProfileEditPage,
    ForumPage, GuidePage, CommandsPage, TermsPage, PrivacyPage, JoinPage, NotFoundPage
} from './pages';

import { app, auth } from './config/firebase';
import { NEWS_SHEET_URL } from './config/constants';
import { LANGUAGES } from './config/languages';

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
        setToastMessage({ text: msg, type: 'info' }); // Adjusted for UI component expectation
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    // Firebase
    const [user, setUser] = useState(null);
    const [db, setDb] = useState(null);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    // User Profile
    const [profile, setProfile] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

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
                    await updateDoc(profileRef, {
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
            await signInWithPopup(auth, provider);
        } catch (e) {
            console.error('Google login failed', e);
            showToast('Googleログインに失敗しました');
        }
    }, [showToast]);

    const handleUserLogout = useCallback(async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            setProfile(null);
        } catch (e) {
            console.error('Logout failed', e);
            showToast('ログアウトに失敗しました');
        }
    }, [showToast]);

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
                    // Simple parsing logic (abbreviated for clarity, actual logic is same as before)
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
                                url: row.c[3]?.v, // URL column
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
    }, [L.server.ip, L.server.port, showToast]);

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
            showToast('クイズ処理にエラーが発生しました');
        }
    }, [quizState.current, showToast, L, quizState]);

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

            {/* 3. Main Content Router */}
            <main className="relative z-10 min-h-screen text-gray-900 dark:text-gray-100">
                {searchTerm && (
                    <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
                        <SearchResultsPage query={searchTerm} L={L} navigate={handleNavigate} />
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
                {!searchTerm && page === 'news' && <NewsPage L={L} newsData={newsData} navigate={handleNavigate} />}
                {!searchTerm && page.startsWith && page.startsWith('news/') && (
                    <NewsDetail L={L} id={page.split('/')[1]} newsData={newsData} navigate={handleNavigate} />
                )}
                {!searchTerm && page === 'articles' && <ArticlesPage L={L} db={db} appId={appId} navigate={handleNavigate} />}
                {!searchTerm && page.startsWith && page.startsWith('articles/') && (
                    <ArticleDetail L={L} id={page.split('/')[1]} db={db} appId={appId} navigate={handleNavigate} />
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
            {toastMessage && <Toast msg={toastMessage} />}

            {/* Chat Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform hover:shadow-purple-500/50 group"
            >
                <MessageCircle size={28} className="group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            <AIChat L={L} isChatOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} currentLang={currentLang} user={user} profile={profile} />
        </div>
    );
}