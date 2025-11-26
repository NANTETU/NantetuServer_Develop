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
            className={`fixed left-0 right-0 z-50 transition-transform duration-300 ${scrollDirection === 'down' && page === 'home' ? '-translate-y-full' : 'translate-y-0'} ${darkMode ? 'bg-gray-900/90 backdrop-blur-lg border-b border-gray-800' : 'bg-white/95 backdrop-blur-lg border-b border-gray-100'} shadow-md`}>
            {hasUnreadNews && newsData.length > 0 && (
                <div onClick={() => navigate('news')} className="bg-red-500 text-white text-center py-1.5 text-sm cursor-pointer hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <Info size={16} /> {L.navbar.unread_news} ({newsData[0].title})
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                {/* Logo and Title */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
                    <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Server Icon" className="w-10 h-10 rounded-full" />
                    <span className="text-xl font-black text-purple-600 dark:text-purple-400">{L.navbar.title}</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavItem target="home" current={page} navigate={navigate} L={L} label={L.navbar.home} />
                    <NavItem target="guide" current={page} navigate={navigate} L={L} label={L.navbar.guide} />
                    <NavItem target="commands" current={page} navigate={navigate} L={L} label={L.navbar.commands} />
                    <NavItem target="news" current={page} navigate={navigate} L={L} label={L.navbar.news} isNew={hasUnreadNews} />
                    <NavItem target="forum" current={page} navigate={navigate} L={L} label={L.navbar.forum} />
                </nav>

                {/* Right side: Search, Theme Toggle, Menu Button */}
                <div className="flex items-center space-x-3">

                    <div className="relative hidden lg:block">
                        <input type="text" placeholder={L.navbar.search_placeholder} className="pl-10 pr-4 py-2 w-48 rounded-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm dark:text-white" value={searchTerm} onChange={handleSearch} />
                        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    <select
                        value={currentLang}
                        onChange={(e) => setCurrentLang(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm py-2 px-3 transition-colors outline-none focus:ring-2 focus:ring-purple-500 hidden sm:block"
                    >
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                    </select>

                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 md:hidden">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                <nav className="flex flex-col space-y-1 px-4">
                    <MobileNavItem target="home" current={page} navigate={navigate} L={L} label={L.navbar.home} />
                    <MobileNavItem target="guide" current={page} navigate={navigate} L={L} label={L.navbar.guide} />
                    <MobileNavItem target="commands" current={page} navigate={navigate} L={L} label={L.navbar.commands} />
                    <MobileNavItem target="news" current={page} navigate={navigate} L={L} label={L.navbar.news} isNew={hasUnreadNews} />
                    <MobileNavItem target="forum" current={page} navigate={navigate} L={L} label={L.navbar.forum} />
                    <MobileNavItem target="terms" current={page} navigate={navigate} L={L} label={L.footer.terms} />
                    <MobileNavItem target="privacy" current={page} navigate={navigate} L={L} label={L.footer.privacy} />
                </nav>
                <div className="relative px-4 mt-3">
                    <input type="text" placeholder={L.navbar.search_placeholder} className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm dark:text-white" value={searchTerm} onChange={handleSearch} />
                    <Search size={18} className="absolute left-7 top-2.5 text-gray-400" />
                </div>
            </div>
        </div>
    );
};

// Nav Item Helper
const NavItem = ({ target, current, navigate, L, label, isNew = false }) => (
    <div className="relative">
        <button
            onClick={() => navigate(target)}
            className={`text-sm font-medium p-2 rounded-lg transition-colors relative 
                ${current === target
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
        >
            {label}
        </button>
        {isNew && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 animate-pulse"></span>}
    </div>
);

// Mobile Nav Item Helper
const MobileNavItem = ({ target, current, navigate, L, label, isNew = false }) => (
    <button
        onClick={() => navigate(target)}
        className={`w-full text-left px-4 py-2 rounded-lg text-base font-medium transition-colors relative flex justify-between items-center
            ${current === target
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-800'
                : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
    >
        {label}
        {isNew && <span className="h-2 w-2 rounded-full ring-1 ring-white bg-red-500"></span>}
    </button>
);


// --- Footer Component ---
export const Footer = ({ L, navigate }) => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">

                    {/* Column 1: Logo and Social */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Server Icon" className="w-10 h-10 rounded-full" />
                            <span className="text-xl font-black text-purple-600 dark:text-purple-400">{L.navbar.title}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                            {L.footer.tagline}
                        </p>
                        <div className="flex space-x-3">
                            <a href={L.social.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                                <Youtube size={24} />
                            </a>
                            <a href={L.social.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter size={24} />
                            </a>
                            <a href={L.social.discord_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors">
                                <MessageCircle size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900 dark:text-white mb-4">{L.footer.navigation}</h3>
                        <ul className="space-y-3">
                            <li><button onClick={() => navigate('home')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.navbar.home}</button></li>
                            <li><button onClick={() => navigate('guide')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.navbar.guide}</button></li>
                            <li><button onClick={() => navigate('commands')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.navbar.commands}</button></li>
                            <li><button onClick={() => navigate('news')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.navbar.news}</button></li>
                            <li><button onClick={() => navigate('forum')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.navbar.forum}</button></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Info */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900 dark:text-white mb-4">{L.footer.info}</h3>
                        <ul className="space-y-3">
                            {/* 修正点: navigate関数を呼び出すように変更 */}
                            <li><button onClick={() => navigate('terms')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.footer.terms}</button></li>
                            <li><button onClick={() => navigate('privacy')} className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{L.footer.privacy}</button></li>
                            <li><a href={L.social.discord_url} target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1">{L.footer.contact} <ExternalLink size={14} /></a></li>
                        </ul>
                    </div>

                    {/* Column 4: Server Info (Placeholder for more complex structure) */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900 dark:text-white mb-4">{L.footer.server_info}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {L.server.ip}:<span className="font-mono text-purple-600 dark:text-purple-400">{L.server.port}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {L.server.version}
                        </p>
                    </div>

                    {/* Column 5: Other links or empty for spacing */}
                    <div className="hidden lg:block"></div>

                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        &copy; {new Date().getFullYear()} {L.footer.copyright}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// --- AI Chat Component (No change) ---
export const AIChat = ({ L, isChatOpen, closeChat, currentLang }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setMessages([{
                role: 'system',
                text: L.footer.chat_welcome
            }]);
        }
    }, [isChatOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const systemPrompt = L.footer.chat_system_prompt.replace('{{lang}}', currentLang);
        const userQuery = input.trim();
        const apiKey = ""
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            tools: [{ "google_search": {} }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            const response = await fetchWithExponentialBackoff(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const candidate = result.candidates?.[0];

            let aiText = L.footer.chat_error;
            if (candidate && candidate.content?.parts?.[0]?.text) {
                aiText = candidate.content.parts[0].text;
            }

            setMessages(p => [...p, { role: 'system', text: aiText }]);
        } catch (error) {
            console.error("API Call Error:", error);
            setMessages(p => [...p, { role: 'system', text: L.footer.chat_error }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Utility for exponential backoff (retry logic)
    const fetchWithExponentialBackoff = async (url, options, maxRetries = 5) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.status !== 429) return response; // Success or non-retryable error
            } catch (error) {
                // Network error, try again
            }

            const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        throw new Error("Max retries exceeded.");
    };


    return (
        <div
            className={`fixed bottom-0 right-0 z-[99] w-full max-w-sm h-full max-h-[85%] sm:max-h-[600px] bg-white dark:bg-gray-900 shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col transition-transform duration-500 ease-in-out ${isChatOpen ? 'translate-y-0 sm:mr-6 sm:mb-6' : 'translate-y-full sm:translate-y-0 sm:mr-6 sm:mb-6 pointer-events-none'}`}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl bg-purple-600 text-white shadow-md">
                <div className="flex items-center gap-2">
                    <MessageCircle size={24} />
                    <h2 className="text-lg font-bold">{L.footer.chat_title}</h2>
                </div>
                <button onClick={closeChat} className="p-2 rounded-full hover:bg-purple-700 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900 custom-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale origin-bottom`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-xs text-gray-400 ml-4">{L.footer.chat_loading}</div>}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSend} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={L.footer.chat_input_placeholder}
                        className="flex-grow pl-5 pr-12 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 disabled:opacity-50 transition-colors">
                        {isLoading ? <Zap size={24} className="animate-pulse" /> : <Send size={24} />}
                    </button>
                </form>
            </div>
        </div>
    );
};