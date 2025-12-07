import React from 'react';
import { Map, BookOpen, Lock, ExternalLink, MessageCircle, Youtube, Twitter } from 'lucide-react';

export const Footer = ({ L, navigate }) => (
    <footer className="bg-gray-900 text-gray-400 text-center border-t border-gray-800 relative overflow-hidden">
        <div className="py-24">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="mb-16 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto border border-white/10 transform hover:scale-[1.01] transition-transform relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all"></div>

                    <h3 className="text-3xl font-black text-white mb-4 flex flex-col md:flex-row items-center justify-center gap-3 relative z-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">{L.footer.promotion}</span>
                    </h3>
                    <p className="text-purple-200 mb-8 text-lg font-medium opacity-80 relative z-10">サーバーサポート、イベント情報、そして新しい仲間があなたを待っています。</p>
                    <a href="https://discord.gg/79H7Jy65nz" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-3 bg-white text-purple-900 font-black px-10 py-4 rounded-full hover:bg-gray-100 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                        <MessageCircle size={22} />{L.footer.promotion_link}
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-sm font-bold text-left max-w-5xl mx-auto border-b border-gray-800 pb-12">
                    <div>
                        <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><Map size={14} /> {L.footer.sitemap}</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => navigate('home')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.home}</button></li>
                            <li><button onClick={() => navigate('articles')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.articles}</button></li>
                            <li><button onClick={() => navigate('news')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.news}</button></li>
                            <li><button onClick={() => navigate('join')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.join}</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><BookOpen size={14} /> Support</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => navigate('guide')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.guide}</button></li>
                            <li><button onClick={() => navigate('commands')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.commands}</button></li>
                            <li><button onClick={() => navigate('forum')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.nav.forum}</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><Lock size={14} /> Legal</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => navigate('terms')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.footer.terms}</button></li>
                            <li><button onClick={() => navigate('privacy')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.footer.privacy}</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-6 uppercase tracking-widest text-xs opacity-50 flex items-center gap-2"><ExternalLink size={14} /> Other</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => navigate('home', 'contact')} className="hover:text-purple-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 group-hover:bg-purple-500 rounded-full transition-colors"></span>{L.footer.contact}</button></li>
                            <li>
                                <a href="http://map.nantetu123.f5.si:35854/" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <Map size={16} className="text-green-500 opacity-80 group-hover:opacity-100" /> マップ
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@なんてつ" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <Youtube size={16} className="text-red-500 opacity-80 group-hover:opacity-100" /> YouTube
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/nantetu123" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <Twitter size={16} className="text-blue-400 opacity-80 group-hover:opacity-100" /> Twitter (X)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center opacity-40 text-xs gap-4">
                    <p>&copy; 2025 Nantetu Server. All rights reserved.</p>
                    <p>Not affiliated with Mojang AB.</p>
                </div>
            </div>
        </div>
    </footer>
);
