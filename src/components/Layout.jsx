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

    // Utility function to get the current page title for the mobile menu
    const getCurrentPageTitle = (p) => {
        // Use optional chaining for safe access
        switch (p) {
            case 'news': return L?.news?.title;
            case 'forum': return L?.forum?.title;
            case 'guide': return L?.guide?.title;
            case 'commands': return L?.commands?.title;
            case 'join': return L?.join?.title;
            case 'privacy': return L?.privacy?.title;
            default: return L?.navbar?.title; // Fallback
        }
    }

    // Determine if the current page has unread news to show the badge
    const isNewsPage = page === 'news';

    return (
        <div
            className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${scrollDirection === "down" ? '-translate-y-full shadow-none' : 'translate-y-0 shadow-lg'} ${isMenuOpen ? 'bg-white dark:bg-gray-900 shadow-xl' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md'}`}
        >
            {/* News Alert Bar */}
            {hasUnreadNews && !isNewsPage && (
                <div className="w-full bg-purple-600 text-white text-center py-2 text-sm font-medium animate-slide-down cursor-pointer hover:bg-purple-700 transition-colors"
                    onClick={() => navigate('news')}
                >
                    {L?.navbar?.news_alert}
                </div>
            )}

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-all duration-300 ${hasUnreadNews && !isNewsPage ? 'mt-0' : 'mt-0'}`}>

                {/* Logo and Title */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
                    <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover shadow-md" />
                    {/* SAFE ACCESS: L?.navbar?.title */}
                    <h2 className="text-2xl font-black dark:text-white hidden sm:block">{L?.navbar?.title}</h2>
                    {/* Show current page title on mobile */}
                    <h2 className="text-xl font-bold dark:text-white sm:hidden">{getCurrentPageTitle(page)}</h2>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                    {L?.navbar?.nav_items.map((item) => (
                        <div
                            key={item.page}
                            onClick={() => navigate(item.page)}
                            className={`relative cursor-pointer py-1 transition-all ${page === item.page ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
                        >
                            {item.title}
                            {page === item.page && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-purple-600 dark:bg-purple-400 rounded-full animate-grow-x"></div>}
                            {item.page === 'news' && hasUnreadNews && (
                                <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping-slow"></span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Utility Icons & Menu Button */}
                <div className="flex items-center space-x-3">

                    {/* Server Status Indicator */}
                    <div className={`w-3 h-3 rounded-full ${serverStatus.online ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'} shadow-md animate-pulse hidden sm:block`} title={serverStatus.online ? L?.navbar?.status_online : L?.navbar?.status_offline}></div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        title={darkMode ? L?.navbar?.toggle_light : L?.navbar?.toggle_dark}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Search Bar (Mobile/Tablet) */}
                    <div className="relative block md:hidden">
                        <input
                            type="text"
                            placeholder={L?.navbar?.search_placeholder} // SAFE ACCESS
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none text-sm dark:text-white transition-all focus:ring-2 focus:ring-purple-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        {searchTerm && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Menu Toggle (Mobile/Tablet) */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm lg:hidden"
                        title={isMenuOpen ? L?.navbar?.close_menu : L?.navbar?.open_menu} // SAFE ACCESS
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                </div>
            </div>

            {/* Mobile/Tablet Menu Overlay */}
            <div className={`fixed inset-0 top-[68px] lg:hidden bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex flex-col space-y-3">
                    {/* Search Bar (Duplicated for better mobile usability inside menu) */}
                    <div className="relative block">
                        <input
                            type="text"
                            placeholder={L?.navbar?.search_placeholder} // SAFE ACCESS
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none text-base dark:text-white transition-all focus:ring-2 focus:ring-purple-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        {searchTerm && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Navigation Links */}
                    {L?.navbar?.nav_items.map((item) => (
                        <button
                            key={item.page}
                            onClick={() => { navigate(item.page); setIsMenuOpen(false); }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex justify-between items-center ${page === item.page ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold' : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {item.title}
                            {item.page === 'news' && hasUnreadNews && (
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    ))}

                    {/* Language Selector */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L?.navbar?.language}</label>
                        <select
                            value={currentLang}
                            onChange={(e) => setCurrentLang(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none text-base dark:text-white"
                        >
                            {Object.keys(LANGUAGES).map((langKey) => (
                                <option key={langKey} value={langKey}>
                                    {LANGUAGES[langKey].language_name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Footer Component ---
export const Footer = ({ L, navigate }) => (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-600 dark:text-gray-400">

            {/* Column 1: Server Info */}
            <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover shadow-md" />
                    <h3 className="text-xl font-bold dark:text-white">{L?.navbar?.title}</h3> {/* SAFE ACCESS */}
                </div>
                <p className="text-sm leading-relaxed mb-4">
                    {L?.footer?.description} {/* SAFE ACCESS */}
                </p>
                <a href={L?.footer?.sns_twitter_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-purple-600 font-medium hover:underline">
                    <Twitter size={16} />
                    {L?.footer?.sns_twitter} {/* SAFE ACCESS */}
                </a>
                <a href={L?.footer?.sns_youtube_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-purple-600 font-medium hover:underline mt-2">
                    <Youtube size={16} />
                    {L?.footer?.sns_youtube} {/* SAFE ACCESS */}
                </a>
            </div>

            {/* Column 2: Navigation */}
            <div className="md:w-1/2">
                <h3 className="text-lg font-bold mb-4 dark:text-white">{L?.footer?.nav_title}</h3> {/* SAFE ACCESS */}
                <ul className="space-y-2 text-sm">
                    <li><button onClick={() => navigate('home')} className="hover:text-purple-600 transition-colors">{L?.footer?.nav_home}</button></li> {/* SAFE ACCESS */}
                    <li><button onClick={() => navigate('news')} className="hover:text-purple-600 transition-colors">{L?.footer?.nav_news}</button></li> {/* SAFE ACCESS */}
                    <li><button onClick={() => navigate('forum')} className="hover:text-purple-600 transition-colors">{L?.footer?.nav_forum}</button></li> {/* SAFE ACCESS */}
                    <li><button onClick={() => navigate('guide')} className="hover:text-purple-600 transition-colors">{L?.footer?.nav_guide}</button></li> {/* SAFE ACCESS */}
                </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="md:w-1/2">
                <h3 className="text-lg font-bold mb-4 dark:text-white">{L?.footer?.resources_title}</h3> {/* SAFE ACCESS */}
                <ul className="space-y-2 text-sm">
                    <li><button onClick={() => navigate('commands')} className="hover:text-purple-600 transition-colors">{L?.footer?.resources_commands}</button></li> {/* SAFE ACCESS */}
                    <li><button onClick={() => navigate('privacy')} className="hover:text-purple-600 transition-colors">{L?.footer?.resources_privacy}</button></li> {/* SAFE ACCESS */}
                    <li><a href={L?.footer?.resources_status_url} target="_blank" rel="noreferrer" className="hover:text-purple-600 transition-colors">{L?.footer?.resources_status} <ExternalLink size={12} className="inline ml-1" /></a></li> {/* SAFE ACCESS */}
                </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
                <h3 className="text-lg font-bold mb-4 dark:text-white">{L?.footer?.contact_title}</h3> {/* SAFE ACCESS */}
                <ul className="space-y-2 text-sm">
                    <li><a href={`mailto:${L?.footer?.contact_email}`} className="hover:text-purple-600 transition-colors">{L?.footer?.contact_email}</a></li> {/* SAFE ACCESS */}
                    <li><a href={L?.footer?.contact_discord_url} target="_blank" rel="noreferrer" className="hover:text-purple-600 transition-colors">{L?.footer?.contact_discord} <ExternalLink size={12} className="inline ml-1" /></a></li> {/* SAFE ACCESS */}
                    <li><a href={L?.footer?.contact_youtube_url} target="_blank" rel="noreferrer" className="hover:text-purple-600 transition-colors">{L?.footer?.contact_youtube} <ExternalLink size={12} className="inline ml-1" /></a></li> {/* SAFE ACCESS */}
                </ul>
            </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Nantetu Server. {L?.footer?.copyright}.
            <p className="mt-1">Built with <Zap size={12} className="inline text-yellow-500" /> by Community.</p>
        </div>
    </footer>
);


// --- AI Chat Component ---
export const AIChat = ({ L, isChatOpen, setIsChatOpen, handleSend, messages, input, setInput, isLoading, handleClearChat }) => {
    const chatWindowRef = useRef(null);

    // Scroll to the bottom whenever messages change or loading state changes
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    if (!isChatOpen) return null;

    return (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[95] w-full md:w-[400px] h-full md:h-[550px] bg-white dark:bg-gray-900 md:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                {/* SAFE ACCESS: L?.footer?.chat_title */}
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><MessageCircle size={24} className="text-purple-600" />{L?.footer?.chat_title}</h3>
                <div className='flex items-center gap-2'>
                    {/* Clear Chat Button */}
                    <button
                        onClick={handleClearChat}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors rounded-full"
                        title={L?.footer?.chat_clear} // SAFE ACCESS
                        disabled={isLoading}
                    >
                        <Trash2 size={20} />
                    </button>
                    {/* Close Button */}
                    <button
                        onClick={() => setIsChatOpen(false)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors rounded-full"
                        title={L?.footer?.chat_close} // SAFE ACCESS
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Info/Warning Area */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs border-b border-yellow-200 dark:border-yellow-900 flex items-center gap-2">
                <Info size={16} />
                {L?.footer?.chat_disclaimer} {/* SAFE ACCESS */}
            </div>

            {/* Message Window */}
            <div ref={chatWindowRef} className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900/70">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-600">
                        <MessageCircle size={48} className="mb-2" />
                        <p className="text-sm">{L?.footer?.chat_start}</p> {/* SAFE ACCESS */}
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-scale origin-bottom`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'}`}>\
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && <div className="text-xs text-gray-400 ml-4">{L?.footer?.chat_loading}</div>} {/* SAFE ACCESS */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSend} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={L?.footer?.chat_input_placeholder} // SAFE ACCESS
                        className="flex-grow pl-5 pr-12 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`absolute right-0 top-0 h-full w-12 flex items-center justify-center rounded-r-xl transition-all ${isLoading ? 'text-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};