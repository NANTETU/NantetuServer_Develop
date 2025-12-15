import React from 'react';
import {
    Gamepad2, HelpCircle, Users, CheckCircle, Server, Zap, Shield, Clock,
    MessageCircle, Terminal, BookOpen, Bell, Send, User, MapPin, Sparkles, ArrowRight
} from 'lucide-react';
import { FeatureCard, AccordionItem, CopyBox } from '../components/UI';


export const JoinPage = ({ L, serverStatus, handleCopy, navigate }) => (
    <div className="pt-20">
        <JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />
    </div>
);

export const JoinSection = ({ L, serverStatus, handleCopy, navigate }) => (
    <section id="join" className="py-24 px-4 relative overflow-hidden animate-fade-in-scale">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center relative z-10">
            <div className="lg:w-1/2">
                <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                    <Gamepad2 size={32} />
                </div>
                <h2 className="text-4xl font-black mb-6 dark:text-white leading-tight">
                    {L.join.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {L.join.subtitle}
                </p>

                <div className="space-y-6 mb-10">
                    <CopyBox
                        label={L.join.label_gamertag}
                        value={L.server.tag}
                        onCopy={handleCopy}
                        lang={L.lang_code}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <CopyBox
                            label={L.join.label_ip}
                            value={L.server.ip}
                            onCopy={handleCopy}
                            lang={L.lang_code}
                        />
                        <CopyBox
                            label={L.join.label_port}
                            value={L.server.port}
                            onCopy={handleCopy}
                            lang={L.lang_code}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <a href="https://discord.gg/79H7Jy65nz" target="_blank" rel="noreferrer" className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1">
                        <MessageCircle size={20} /> {L.join.btn_discord}
                    </a>
                    <button onClick={() => navigate('guide')} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-200 dark:border-gray-700">
                        <BookOpen size={20} /> {L.join.btn_guide}
                    </button>
                </div>
            </div>

            <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-0 overflow-hidden group rounded-3xl shadow-2xl">
                <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/Minecraft%20Screenshot.png" alt={L.join.img_alt_text} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white font-bold text-2xl drop-shadow-lg mb-2">{L.join.img_overlay_text}</p>
                        <div className="w-16 h-1 bg-yellow-400 rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default function HomePage({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion, showToast, newsData, hasUnreadNews }) {
    const QUIZ_DATA = L.quiz_data;
    const latestNews = newsData && newsData.length > 0 ? newsData.slice(0, 3) : L.news.default_data;

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
            // Demo-only for now unless backend exists
            // const res = await fetch('/api/contact', ...); 
            // Mock success
            await new Promise(r => setTimeout(r, 1000));
            if (showToast) showToast('送信しました。', 'success');
            e.target.reset();
        } catch (error) {
            console.error('Contact Error:', error);
            if (showToast) showToast('エラーが発生しました。時間を置いて再試行してください。', 'error');
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
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer" onClick={() => navigate(`news/${item.id}`)}>
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

                    {/* Quiz UI */}
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