import React, { useState, useEffect } from 'react';
import { Gamepad2, HelpCircle, Users, CheckCircle, Server, Zap, Shield, Clock, MessageCircle, Terminal, BookOpen, Bell, Send, User, MapPin, ExternalLink, Mail, ArrowRight, Loader2, Copy } from 'lucide-react';
// UIコンポーネントをcomponents/UIからインポートするようにパスを修正
import { FeatureCard, AccordionItem, CopyBox, NewsItem, Toast } from '../components/UI';
import { addDoc, collection, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

// --- Sub-Components specific to Home ---

// IPアドレスのコピーボックス
const CopyBoxImpl = ({ L, handleCopy }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.join.ip_label}</label>
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value="mc.nantetu.com"
                readOnly
                className="flex-grow px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-lg font-mono dark:text-white border border-gray-200 dark:border-gray-600 select-all focus:outline-none"
            />
            <button
                onClick={() => handleCopy('mc.nantetu.com')}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all focus:ring-4 focus:ring-purple-300 shadow-md"
                aria-label="Copy IP Address"
            >
                <Copy size={24} />
            </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{L.home.join.port_label}: 25565</p>
    </div>
);


export const JoinSection = ({ L, serverStatus, navigate, setToast }) => {
    const handleCopy = (text) => {
        if (!navigator.clipboard) {
            console.error('Clipboard API not available.');
            // Fallback for older browsers (or Canvas)
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setToast({ message: L.home.join.copy_success, type: 'success' });
            } catch (err) {
                console.error('Copy failed:', err);
                setToast({ message: 'コピーに失敗しました。手動でコピーしてください。', type: 'error' });
            }
            document.body.removeChild(textArea);
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            setToast({ message: L.home.join.copy_success, type: 'success' });
        }).catch(err => {
            console.error('Could not copy text: ', err);
            setToast({ message: 'コピーに失敗しました。手動でコピーしてください。', type: 'error' });
        });
    };

    return (
        <section id="join" className="py-24 px-4 relative overflow-hidden animate-fade-in-scale">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center relative z-10">
                <div className="lg:w-1/2">
                    <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                        <Gamepad2 size={32} />
                    </div>
                    <h2 className="text-4xl font-black mb-6 dark:text-white leading-tight">
                        {L.home.join.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {L.home.join.subtitle}
                    </p>

                    <CopyBoxImpl L={L} handleCopy={handleCopy} />

                    <button
                        onClick={() => navigate('guide')}
                        className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-purple-600 text-purple-600 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        <ArrowRight size={20} />
                        {L.home.join.button_connect}
                    </button>
                </div>

                <div className="lg:w-1/2 relative">
                    {/* Decorative Minecraft-like block or server status display */}
                    <div className="relative p-12 bg-purple-50 dark:bg-gray-800/50 rounded-3xl shadow-2xl border-4 border-purple-200 dark:border-gray-700/50">
                        <Server size={64} className="text-purple-500 mx-auto mb-4 animate-float" />
                        <h3 className="text-2xl font-bold text-center dark:text-white mb-2">
                            Nantetu Server Status
                        </h3>
                        <p className={`text-center text-lg font-semibold ${serverStatus.online ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            {serverStatus.online ? L.nav.status_online : L.nav.status_offline}
                        </p>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {L.home.hero.status(serverStatus.players)}
                        </p>
                    </div>
                </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-1/4 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </section>
    );
};


// --- Contact Form ---
export const ContactForm = ({ L, db, appId, DISCORD_WEBHOOK_URL, setToast }) => {
    const [status, setStatus] = useState(''); // 'success', 'error', 'sending', ''

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const contactCollectionPath = `artifacts/${appId}/public/data/contacts`;

        try {
            // 1. Save to Firestore (Public Collection)
            const docRef = await addDoc(collection(db, contactCollectionPath), {
                name: data.name,
                email: data.email,
                message: data.message,
                timestamp: serverTimestamp(),
            });

            console.log("Contact form submitted to Firestore with ID: ", docRef.id);

            // 2. (Optional) Send to Discord Webhook (if needed, this is usually handled by a backend server)
            // For now, we rely only on the Firestore save.

            setStatus('success');
            e.target.reset();
            setToast({ message: L.home.contact.success, type: 'success' });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setStatus('error');
            setToast({ message: L.home.contact.error, type: 'error' });
        }
    };

    return (
        <section id="contact" className="py-24 px-4 bg-gray-50 dark:bg-gray-800 animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Mail className="text-purple-500" size={32} />{L.home.contact.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{L.home.contact.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact.contact_name}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                    <input type="text" name="name" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact.contact_placeholder_name} required />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact.contact_email}</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                    <input type="email" name="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact.contact_placeholder_email} required />
                                </div>
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact.contact_message}</label>
                            <textarea name="message" rows="5" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder={L.home.contact.contact_placeholder_msg} required></textarea>
                        </div>
                        <button type="submit" disabled={status === 'sending'} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {status === 'sending' ? (
                                <><Loader2 className="animate-spin" size={20} /> {L.footer.chat_loading}</>
                            ) : (
                                <><Send size={20} /> {L.home.contact.send_button}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};


// --- Main Home Page ---
export const HomePage = ({ L, navigate, serverStatus, hasUnreadNews, newsData, userId, db, appId, DISCORD_WEBHOOK_URL, setToast }) => {

    // News data for display (latest 3)
    const latestNews = (newsData && newsData.length > 0)
        ? newsData.slice(0, 3)
        : L.news.default_data.slice(0, 3);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <header className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-6xl md:text-7xl font-black dark:text-white mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">{L.home.hero.title_p1}</span>
                        <br />{L.home.hero.title_p2}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                        {L.home.hero.subtitle}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('join')}
                            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-purple-500/50 transition-all transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            <Zap size={20} className="mr-2" />
                            {L.home.hero.button_join}
                        </button>
                        <button
                            onClick={() => navigate('guide')}
                            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border-2 border-purple-600 text-purple-600 font-bold text-lg rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            <HelpCircle size={20} className="mr-2" />
                            {L.home.hero.button_guide}
                        </button>
                    </div>

                    {/* Server Status Box */}
                    <div className="mt-12 inline-flex items-center justify-center px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all">
                        <div className={`w-3 h-3 rounded-full mr-3 ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-md font-semibold dark:text-white">
                            {L.home.hero.status(serverStatus.players)}
                        </span>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5 overflow-hidden">
                    <div className="w-[800px] h-[800px] bg-purple-500 rounded-full absolute top-[-400px] left-[-300px] blur-[150px] animate-float"></div>
                    <div className="w-[600px] h-[600px] bg-indigo-500 rounded-full absolute bottom-[-300px] right-[-200px] blur-[100px] animate-float" style={{ animationDelay: '1.5s' }}></div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-black mb-12 dark:text-white">サーバーの主な特徴</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {L.home.features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                Icon={feature.icon}
                                title={feature.title}
                                desc={feature.desc}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* News Section (Preview) */}
            <section id="latest-news" className="py-24 px-4 bg-gray-50 dark:bg-gray-800 animate-fade-in-up">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12 border-b border-purple-200 dark:border-purple-800 pb-4">
                        <div>
                            <h2 className="text-3xl font-black dark:text-white flex items-center gap-3"><Bell className="text-purple-500" size={32} />{L.home.news_section.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{L.home.news_section.subtitle}</p>
                        </div>
                        <button
                            onClick={() => navigate('news')}
                            className="flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors"
                        >
                            {L.home.news_section.button_all} <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestNews.map((item) => (
                            // NewsItem is a standalone card, not the clickable list item from SubPages
                            <NewsItem key={item.id} item={item} L={L} isPreview={true} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <JoinSection L={L} serverStatus={serverStatus} navigate={navigate} setToast={setToast} />

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-4 bg-white dark:bg-gray-900 animate-fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><HelpCircle className="text-purple-500" size={32} />{L.home.faq.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{L.home.faq.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        {L.home.faq.questions.map((item, index) => (
                            <AccordionItem key={index} title={item.q} content={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <ContactForm L={L} db={db} appId={appId} DISCORD_WEBHOOK_URL={DISCORD_WEBHOOK_URL} setToast={setToast} />

            <div className="pb-16" />
        </div>
    );
}

// ----------------------------------------------------
// UI Components used in Home (Moved to UI.jsx but included here for full context check)
// ----------------------------------------------------

// FeatureCard (Used in Features Section)
// Should be moved to UI.jsx

// AccordionItem (Used in FAQ)
// Should be moved to UI.jsx

// NewsItem (Used in News Preview)
// Should be moved to UI.jsx