import React, { useState, useEffect } from 'react';
import {
    Menu, X, Moon, Sun, Search, Map, Home, FileText,
    Bell, BookOpen, Terminal, ExternalLink
} from 'lucide-react';

const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState("up");
    const [scrolledToTop, setScrolledToTop] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (Math.abs(scrollY - lastScrollY) > 5)) {
                setScrollDirection(direction);
            }
            setScrolledToTop(scrollY < 50);
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDirection);
        return () => window.removeEventListener("scroll", updateScrollDirection);
    }, [scrollDirection]);
    return { scrollDirection, scrolledToTop };
};

export const Navbar = ({
    L, page, navigate, darkMode, setDarkMode,
    isMenuOpen, setIsMenuOpen, currentLang, setCurrentLang,
    searchTerm, searchValue, handleSearch, serverStatus, hasUnreadNews, newsData,
    user, profile, isProfileLoading, onLogin, onLogout
}) => {
    const { scrollDirection, scrolledToTop } = useScrollDirection();
    const isHidden = scrollDirection === "down" && !scrolledToTop && !isMenuOpen;

    const isGoogleUser = user && !user.isAnonymous;
    const displayName = (profile && profile.name) || (user && user.displayName) || '';
    const avatarChar = (displayName || 'U').charAt(0).toUpperCase();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <>
            <div
                className={`fixed left-0 right-0 z-[500] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                    }`}
            >
                <nav className={`transition-all duration-500 relative z-20 ${scrolledToTop && !isMenuOpen ? 'bg-transparent py-4' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm py-0'
                    }`} role="navigation" aria-label="メインナビゲーション">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Left: Logo */}
                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
                                <div className="relative">
                                    <img
                                        src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg"
                                        alt="Nantetu Server Icon"
                                        className="w-10 h-10 rounded-xl shadow-lg group-hover:scale-110 transition-transform object-cover ring-2 ring-white dark:ring-gray-800"
                                    />
                                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-gray-900 rounded-full ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                </div>
                                <span className={`font-black text-xl tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors hidden sm:block ${scrolledToTop && !isMenuOpen && !darkMode ? 'text-white drop-shadow-md' : 'text-gray-800 dark:text-white'}`}>なんてつサーバー</span>
                            </div>

                            {/* Right Container: Nav Links + Search + Actions */}
                            <div className="hidden lg:flex items-center gap-6 ml-auto">

                                {/* Nav Links */}
                                <div className="flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/20 dark:border-white/10 shadow-sm">
                                    {['home', 'articles', 'news', 'commands', 'guide', 'map'].map((key) => {
                                        if (key === 'map') {
                                            return (
                                                <a
                                                    key={key}
                                                    href="http://map.nantetu123.f5.si:35854/"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${scrolledToTop && !darkMode ? 'text-white hover:bg-white/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                >
                                                    <Map size={16} /> マップ
                                                </a>
                                            );
                                        }
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => navigate(key)}
                                                className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all ${page === key
                                                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 shadow-md ring-1 ring-gray-100 dark:ring-gray-600'
                                                    : scrolledToTop && !darkMode ? 'text-white hover:bg-white/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {L.nav[key]}
                                                {key === 'news' && hasUnreadNews && (
                                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Search & Toggles & Server Status + Auth */}
                                <div className={`flex items-center gap-3 border-l pl-6 ${scrolledToTop && !darkMode ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <div className="relative group">
                                        <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${scrolledToTop && !darkMode ? 'text-white/70 group-focus-within:text-purple-500' : 'text-gray-400 group-focus-within:text-purple-500'}`} />
                                        <input type="text" placeholder={L.footer.search_placeholder} value={searchValue} onChange={handleSearch} className={`pl-9 pr-4 py-2 w-32 focus:w-48 rounded-full text-sm border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all ${scrolledToTop && !darkMode ? 'bg-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 dark:text-white'}`} />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all font-bold text-xs border border-transparent ${scrolledToTop && !darkMode ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}>{currentLang === 'ja' ? 'EN' : 'JP'}</button>
                                            <button onClick={() => setDarkMode(!darkMode)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all border border-transparent ${scrolledToTop && !darkMode ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-purple-100 dark:hover:bg-gray-700'}`}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
                                        </div>

                                        {/* Auth: Login button or profile avatar */}
                                        <div className="relative">
                                            {!isGoogleUser ? (
                                                <button
                                                    onClick={() => onLogin && onLogin()}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${scrolledToTop && !darkMode
                                                        ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                                                        : 'bg-purple-600 text-white border-transparent hover:bg-purple-700'
                                                        }`}
                                                >
                                                    {isProfileLoading ? '読み込み中...' : 'Googleでログイン'}
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsProfileMenuOpen((v) => !v)}
                                                        className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                                    >
                                                        {avatarChar}
                                                    </button>
                                                    {displayName && (
                                                        <span className={`text-xs font-bold hidden xl:inline ${scrolledToTop && !darkMode ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                                            {displayName}
                                                        </span>
                                                    )}

                                                    {isProfileMenuOpen && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                                                            <button
                                                                type="button"
                                                                onClick={() => { setIsProfileMenuOpen(false); navigate('user'); }}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            >
                                                                プロフィール
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => { setIsProfileMenuOpen(false); navigate('user-edit'); }}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            >
                                                                プロフィールを編集
                                                            </button>
                                                            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                                                            <button
                                                                type="button"
                                                                onClick={() => { setIsProfileMenuOpen(false); onLogout && onLogout(); }}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                ログアウト
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="lg:hidden flex items-center gap-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${serverStatus.online
                                    ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-400 border-gray-200'
                                    } ${scrolledToTop && !isMenuOpen && !darkMode ? 'bg-black/30 text-white border-white/20' : ''}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${serverStatus.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                    <span className="hidden xs:inline">{serverStatus.online ? `${serverStatus.players} Online` : 'Offline'}</span>
                                </div>
                                <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full transition-colors ${scrolledToTop && !isMenuOpen && !darkMode ? 'text-white hover:bg-white/10' : 'text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-xl transition-colors ${scrolledToTop && !isMenuOpen && !darkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav Dropdown */}
                    <div className={`lg:hidden absolute w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isMenuOpen ? 'max-h-[800px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            <div className="relative mb-6">
                                <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder={L.footer.search_placeholder} value={searchValue} onChange={handleSearch} className="pl-11 pr-4 py-3 w-full rounded-xl text-base bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all dark:text-white" />
                            </div>
                            {['home', 'articles', 'news', 'guide', 'commands', 'map'].map((key) => {
                                if (key === 'map') {
                                    return (
                                        <a
                                            key={key}
                                            href="http://map.nantetu123.f5.si:35854/"
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="relative flex items-center justify-between w-full text-left px-4 py-4 text-base font-bold rounded-xl transition-all active:scale-95 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Map size={18} className="opacity-70" />
                                                マップ
                                            </span>
                                            <ExternalLink size={16} className="opacity-50" />
                                        </a>
                                    );
                                }
                                return (
                                    <button
                                        key={key}
                                        onClick={() => { navigate(key); setIsMenuOpen(false); }}
                                        className={`relative flex items-center justify-between w-full text-left px-4 py-4 text-base font-bold rounded-xl transition-all active:scale-95 ${page === key
                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            {key === 'home' && <Home size={18} className="opacity-70" />}
                                            {key === 'articles' && <FileText size={18} className="opacity-70" />}
                                            {key === 'news' && <Bell size={18} className="opacity-70" />}
                                            {key === 'guide' && <BookOpen size={18} className="opacity-70" />}
                                            {key === 'commands' && <Terminal size={18} className="opacity-70" />}
                                            {L.nav[key]}
                                        </span>
                                        {key === 'news' && hasUnreadNews && (
                                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">NEW</span>
                                        )}
                                    </button>
                                );
                            })}

                            <a
                                href="http://map.nantetu123.f5.si:35854/"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            >
                                <Map size={20} /> マップ
                            </a>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                            <button onClick={() => setCurrentLang(currentLang === 'ja' ? 'en' : 'ja')} className="block w-full text-left px-4 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl">
                                🌐 {currentLang === 'ja' ? 'Switch to English' : '日本語に切り替え'}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            {/* Backdrop for Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMenuOpen(false)}></div>
            )}
        </>
    );
};
