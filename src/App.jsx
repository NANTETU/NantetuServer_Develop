import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth, db } from './utils/firebase';

// Data
import { LANGUAGES, NEWS_SHEET_URL } from './data/languages';

// Components
import { LoadingScreen, LoadingBar, Toast } from './components/UI';
import { Navbar, Footer, AIChat } from './components/Layout';
import HomePage from './pages/Home';
import { NewsPage, ForumPage, GuidePage, CommandsPage } from './pages/SubPages';

// Styles (Normally in CSS, but kept here for JS-in-CSS compatibility with original)
const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
    :root { --font-sans: 'Noto Sans JP', sans-serif; }
    body { font-family: var(--font-sans); }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes progress { 0% { width: 0%; margin-left: 0; } 50% { width: 70%; margin-left: 0; } 100% { width: 100%; margin-left: 0; } }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-progress { animation: progress 1s ease-in-out infinite; }
    .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 5px; }
    .bg-grid-pattern { background-image: radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px); background-size: 24px 24px; }
    .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); }
    .dark .glass-panel { background: rgba(17, 24, 39, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); }
  `}</style>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [page, setPage] = useState('home'); 
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0, loading: true });
  const [toastMessage, setToastMessage] = useState(null);
  const [quizState, setQuizState] = useState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('ja');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [hasUnreadNews, setHasUnreadNews] = useState(false);
  const [user, setUser] = useState(null);

  const L = LANGUAGES[currentLang];
  // Assign to global for easy access in components if needed, though props are better
  App.currentLang = currentLang;

  // --- Effects ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    const initAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    setTimeout(() => setIsAppLoading(false), 1500);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`https://api.mcsrvstat.us/bedrock/2/${L.server.ip}:${L.server.port}`);
            const data = await res.json();
            setServerStatus({ online: data.online, players: data.online ? data.players.online : 0, loading: false });
        } catch { setServerStatus({ online: false, players: 0, loading: false }); }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);

    const fetchNews = async () => {
        try {
            const res = await fetch(NEWS_SHEET_URL);
            if (res.ok) {
                const text = await res.text();
                const json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));
                if (json.table?.rows) {
                    const parsed = json.table.rows.map((row, i) => ({
                        id: i + 100, date: row.c[0]?.v || '', title: row.c[1]?.v || '', content: row.c[2]?.v || '', url: row.c[3]?.v, type: row.c[2]?.v?.includes('メンテナンス') ? 'maintenance' : 'info'
                    })).filter(i => i.title);
                    setNewsData(parsed.sort((a, b) => b.date.localeCompare(a.date)));
                    const lastRead = localStorage.getItem('lastReadNewsId');
                    if (parsed[0]?.id && (!lastRead || parsed[0].id > parseInt(lastRead))) setHasUnreadNews(true);
                }
            }
        } catch {}
    };
    fetchNews();

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };
  const handleCopy = (text) => { navigator.clipboard.writeText(text); showToast(L.footer.copy_success); };
  const handleQuizAnswer = (sel) => {
    const isCorrect = sel === L.quiz_data[quizState.current].answer;
    setQuizState(p => ({ ...p, showResult: true, isCorrect }));
    setTimeout(() => {
      if (quizState.current < L.quiz_data.length - 1) setQuizState(p => ({ ...p, current: p.current + 1, score: isCorrect ? p.score + 1 : p.score, showResult: false, isCorrect: null }));
      else setQuizState(p => ({ ...p, score: isCorrect ? p.score + 1 : p.score, finished: true, showResult: false }));
    }, 1500);
  };
  const resetQuiz = () => setQuizState({ started: false, current: 0, score: 0, finished: false, showResult: false, isCorrect: null });

  const navigate = (target, sectionId) => {
      if (page === target && !sectionId) return;
      setIsPageLoading(true);
      if (target === 'news' && hasUnreadNews) { setHasUnreadNews(false); localStorage.setItem('lastReadNewsId', newsData[0]?.id); }
      setTimeout(() => {
          setPage(target); setIsMenuOpen(false); setActiveAccordion(null); setIsPageLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (sectionId && target === 'home') setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 100);
      }, 600);
  };
  const handleSearch = (e) => setSearchTerm(e.target.value); // Simplified search handler for now

  // --- Render ---
  const renderPage = () => {
      switch (page) {
          case 'home': return <HomePage L={L} serverStatus={serverStatus} quizState={quizState} setQuizState={setQuizState} resetQuiz={resetQuiz} handleQuizAnswer={handleQuizAnswer} handleCopy={handleCopy} scrollToSection={(id) => navigate('home', id)} navigate={navigate} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} showToast={showToast} />;
          case 'news': return <NewsPage L={L} newsData={newsData} />;
          case 'forum': return <ForumPage L={L} user={user} />;
          case 'guide': return <GuidePage L={L} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />;
          case 'commands': return <CommandsPage L={L} />;
          // Add Terms/Privacy here using similar structure if needed, simplified for file limit
          default: return <HomePage L={L} serverStatus={serverStatus} quizState={quizState} setQuizState={setQuizState} resetQuiz={resetQuiz} handleQuizAnswer={handleQuizAnswer} handleCopy={handleCopy} scrollToSection={(id) => navigate('home', id)} navigate={navigate} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} showToast={showToast} />;
      }
  };

  return (
    <>
      {isAppLoading && <LoadingScreen />}
      <LoadingBar isLoading={isPageLoading} />
      <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f8f9fa] text-gray-900'} font-sans`}>
        <CustomStyles />
        <Navbar L={L} page={page} navigate={navigate} darkMode={darkMode} setDarkMode={setDarkMode} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} currentLang={currentLang} setCurrentLang={setCurrentLang} searchTerm={searchTerm} handleSearch={handleSearch} serverStatus={serverStatus} hasUnreadNews={hasUnreadNews} newsData={newsData} />
        
        <main className={`flex-grow relative z-0 ${hasUnreadNews ? 'pt-[96px]' : 'pt-14'} transition-all duration-300`}>
           {renderPage()}
        </main>
        
        <Footer L={L} navigate={navigate} />
        <div className="fixed bottom-14 right-6 z-[90]">
           <button onClick={() => setIsChatOpen(true)} className="group relative w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <MessageCircle size={32} className="relative z-10" />
           </button>
        </div>
        <AIChat L={L} isChatOpen={isChatOpen} closeChat={() => setIsChatOpen(false)} currentLang={currentLang} />
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    </>
  );
}