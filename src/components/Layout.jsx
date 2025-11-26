import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, Search, MessageCircle, ExternalLink, Youtube, Twitter, Zap, Trash2, Send, Info } from 'lucide-react';
import { LANGUAGES } from '../data/languages';

// --- Scroll Hook (Internal) ---
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (Math.abs(scrollY - lastScrollY) > 10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection]);
  return scrollDirection;
};

// --- Navbar Component ---
export const Navbar = ({ 
  L, page, navigate, darkMode, setDarkMode, 
  isMenuOpen, setIsMenuOpen, currentLang, setCurrentLang, 
  searchTerm, handleSearch, serverStatus, hasUnreadNews, newsData 
}) => {
    const scrollDirection = useScrollDirection();

    return (
    <div 
        className={`fixed left-0 right-0 z-[500] flex flex-col shadow-md transition-all duration-300 ease-in-out ${
          scrollDirection === "down" ? "-top-24" : "top-0"
        }`}
    >
          <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14">
                {/* Left: Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
                  <img 
                    src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" 
                    alt="Nantetu Server Icon" 
                    className="w-9 h-9 rounded-full shadow-lg group-hover:scale-110 transition-transform object-cover"
                  />
                  <span className="font-black text-lg tracking-tight text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">なんてつサーバー</span>
                </div>

                {/* Right Container: Nav Links + Search + Actions */}
                <div className="hidden lg:flex items-center gap-6 ml-auto">
                  
                  {/* Nav Links */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    {['home', 'join', 'news', 'forum', 'commands', 'guide'].map((key) => (
                        <button 
                          key={key}
                          onClick={() => navigate(key)} 
                          className={`relative px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                              page === key 
                              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-sm' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {L.nav[key]}
                          {key === 'news' && hasUnreadNews && (
                              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                          )}
                        </button>
                    ))}
                  </div>

                  {/* Search & Toggles & Server Status */}
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <input type="text" placeholder={L.footer.search_placeholder} value={searchTerm} onChange={handleSearch} className="pl-9 pr-4 py-1.5 w-40 focus:w-56 rounded-full text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" />
                    </div>

                    {/* Server Status Indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        serverStatus.loading ? 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:border-gray-700' :
                        serverStatus.online 
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900' 
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${serverStatus.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span>
                            {serverStatus.loading 
                                ? L.status.loading 
                                : serverStatus.online 
                                    ? L.status.online(serverStatus.players)
                                    : L.status.offline}
                        </span>
                    </div>

                    <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors font-bold text-xs">{currentLang === 'ja' ? 'EN' : 'JP'}</button>
                    <button onClick={() => setDarkMode(!darkMode)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                  <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-yellow-400">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
              </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <div className={`lg:hidden absolute w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-4 pb-6 space-y-2">
                  <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder={L.footer.search_placeholder} value={searchTerm} onChange={handleSearch} className="pl-11 pr-4 py-3 w-full rounded-xl text-base bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" />
                  </div>
                  {['home', 'join', 'news', 'forum', 'guide', 'commands'].map((key) => (
                      <button 
                            key={key}
                            onClick={() => navigate(key)} 
                            className="relative flex items-center justify-between w-full text-left px-4 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-600 rounded-xl transition-colors"
                        >
                            {L.nav[key]}
                            {key === 'news' && hasUnreadNews && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">NEW</span>
                            )}
                      </button>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="block w-full text-left px-4 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl">
                      🌐 {currentLang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
                  </button>
                </div>
            </div>
          </nav>

          {/* Static News Banner */}
          {newsData.length > 0 && hasUnreadNews && (
              <div className="bg-purple-600 text-white text-sm font-bold py-2 px-4 text-center z-10 shadow-md relative animate-fade-in-up">
                  <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
                      <Info size={16} className="flex-shrink-0 animate-pulse" />
                      <span className="opacity-90">NEWS:</span>
                      <span className="truncate max-w-lg">{newsData[0].title}</span>
                      <button onClick={() => navigate('news')} className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-xs transition-colors flex-shrink-0">
                          DETAILS
                      </button>
                  </div>
              </div>
          )}
    </div>
    );
};

// --- Footer Component ---
export const Footer = ({ L, navigate }) => (
    <footer className="bg-gray-900 text-gray-400 text-center border-t border-gray-800 relative overflow-hidden">
        <div className="py-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="mb-12 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-10 shadow-2xl max-w-2xl mx-auto border border-white/10 transform hover:scale-[1.02] transition-transform">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2"><ExternalLink size={24} className="text-yellow-400" />{L.footer.promotion}</h3>
                    <p className="text-purple-200 mb-6">Join the community for support, events, and more!</p>
                    <a href="https://discord.gg/79H7Jy65nz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-purple-900 font-black px-8 py-3 rounded-full hover:bg-gray-100 transition-all shadow-lg"><MessageCircle size={20} />{L.footer.promotion_link}</a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm font-bold text-left max-w-4xl mx-auto">
                    <div>
                        <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">{L.footer.sitemap}</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => navigate('home')} className="hover:text-purple-400 transition-colors">{L.nav.home}</button></li>
                            <li><button onClick={() => navigate('news')} className="hover:text-purple-400 transition-colors">{L.nav.news}</button></li>
                            <li><button onClick={() => navigate('join')} className="hover:text-purple-400 transition-colors">{L.nav.join}</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">Support</h4>
                        <ul className="space-y-2">
                             <li><button onClick={() => navigate('guide')} className="hover:text-purple-400 transition-colors">{L.nav.guide}</button></li>
                             <li><button onClick={() => navigate('commands')} className="hover:text-purple-400 transition-colors">{L.nav.commands}</button></li>
                        </ul>
                    </div>
                    <div>
                         <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">Legal</h4>
                         <ul className="space-y-2">
                             <li><button onClick={() => navigate('terms')} className="hover:text-purple-400 transition-colors">{L.footer.terms}</button></li>
                             <li><button onClick={() => navigate('privacy')} className="hover:text-purple-400 transition-colors">{L.footer.privacy}</button></li>
                         </ul>
                    </div>
                    <div>
                         <h4 className="text-white mb-4 uppercase tracking-wider opacity-50">Other</h4>
                         <ul className="space-y-2">
                             <li><button onClick={() => navigate('home', 'contact')} className="hover:text-purple-400 transition-colors">{L.footer.contact}</button></li>
                             <li>
                                <a href="https://www.youtube.com/@なんてつ" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <Youtube size={14} /> YouTube
                                </a>
                             </li>
                             <li>
                                <a href="https://twitter.com/nantetu123" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <Twitter size={14} /> Twitter (X)
                                </a>
                             </li>
                         </ul>
                    </div>
                </div>
                <p className="text-sm opacity-50">&copy; 2025 Nantetu Server. All rights reserved.<br/>Not affiliated with Mojang AB.</p>
            </div>
        </div>
      </footer>
);

// --- AI Chat Component ---
// (API logic is mocked here to keep file size down, but structure is ready)
const fetchGeminiResponse = async (chatHistory, currentLang) => {
    // In a real file split, this would be imported from utils/api.js
    // For now we simulate or use the injected key from environment
    const apiKey = ""; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    // Simplification for the file splitter context:
    try {
        const systemPrompt = "You are the Nantetu Server AI."; // Simplify for brevity in Layout
        const contents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...chatHistory.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }))
        ];
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contents })
        });
        if (!response.ok) throw new Error("API Error");
        const result = await response.json();
        return { text: result.candidates?.[0]?.content?.parts?.[0]?.text, error: null };
    } catch (e) {
        return { text: null, error: currentLang === 'ja' ? "エラー" : "Error" };
    }
};

export const AIChat = ({ L, isChatOpen, closeChat, currentLang }) => {
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
    const { text, error } = await fetchGeminiResponse(newHistory, currentLang);
    setIsLoading(false);
    if (text) setChatHistory(prev => [...prev, { role: 'model', text: text }]);
    else setChatHistory(prev => [...prev, { role: 'model', text: error, isError: true }]);
  };

  const handleClear = () => setChatHistory([]);
  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-end justify-end md:justify-center p-0 md:p-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full md:max-w-md h-full md:h-[650px] flex flex-col rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-slide-in-up border border-gray-200 dark:border-gray-700 overflow-hidden">
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
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><MessageCircle size={36} className="text-purple-500" /></div>
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
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={L.footer.chat_input_placeholder} className="flex-grow pl-5 pr-12 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white" disabled={isLoading}/>
            <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center shadow-md"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
};