import React from 'react';
import { Gamepad2, HelpCircle, Users, CheckCircle, Server, Zap, Shield, Clock, MessageCircle, Terminal, BookOpen, Bell, Send, User, MapPin, ExternalLink } from 'lucide-react';
import { FeatureCard, AccordionItem, CopyBox } from '../components/UI';
import { DISCORD_WEBHOOK_URL } from '../data/languages';

// --- Sub-Components specific to Home ---

// JoinSectionを外部からインポートできるようにexportキーワードを追加
export const JoinSection = ({ L, serverStatus, handleCopy, navigate }) => (
    <section id="join" className="py-24 px-4 relative overflow-hidden animate-fade-in-scale">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/50 dark:to-purple-900/10 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-sm font-bold mb-4 animate-bounce">Let's Play Together</span>
                <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white tracking-tight">{L.join.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">{L.join.subtitle}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row">
                <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-purple-500/20">{L.join.bedrock_tag}</span>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${serverStatus.online ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400' : 'border-red-200 bg-red-50 text-red-700'}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {serverStatus.online ? L.join.status_online : L.join.status_offline}
                        </div>
                    </div>
                    <h2 className="text-3xl font-black mb-6 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">{L.join.info_title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed text-lg">{L.join.info_desc}</p>
                    <div className="space-y-6 mb-10">
                        {/* 修正: App.currentLang を L.lang_code に変更（言語コードはLオブジェクト内にあると仮定） */}
                        <CopyBox label={L.join.label_gamertag} value={L.server.tag} onCopy={handleCopy} lang={L.lang_code} />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <CopyBox label={L.join.label_ip} value={L.server.ip} onCopy={handleCopy} lang={L.lang_code} />
                            <CopyBox label={L.join.label_port} value={L.server.port} onCopy={handleCopy} lang={L.lang_code} />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="https://discord.gg/79H7Jy65nz" target="_blank" rel="noreferrer" className="flex-1 group relative bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 overflow-hidden">
                            <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                            <MessageCircle size={20} className="relative z-10" />
                            <span className="relative z-10">{L.join.btn_discord}</span>
                        </a>
                        <button onClick={() => navigate('guide')} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                            <ExternalLink size={20} />
                            {L.join.btn_guide}
                        </button>
                    </div>
                </div>
                <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-0 overflow-hidden group">
                    <img src="https://github.com/NANTETU/Nantetu-Server/blob/main/Minecraft%20Screenshot.png?raw=true" alt={L.join.img_alt_text} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-white font-bold text-2xl drop-shadow-lg mb-2">{L.join.img_overlay_text}</p>
                            <div className="w-16 h-1 bg-yellow-400 rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default function HomePage({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion, showToast }) {
    const QUIZ_DATA = L.quiz_data;

    // Contact Form Logic with Webhook
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;

        if (!DISCORD_WEBHOOK_URL) {
            showToast(L.lang_name === "日本語" ? "Webhookが設定されていません (デモ)" : "Webhook not configured (Demo)");
            return;
        }

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [{
                        title: "📬 新しいお問い合わせ",
                        color: 0x8b5cf6, // Purple
                        fields: [
                            { name: "お名前 (MCID)", value: name, inline: true },
                            { name: "連絡先", value: email, inline: true },
                            { name: "メッセージ", value: message }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });

            if (response.ok) {
                showToast(L.lang_name === "日本語" ? "送信しました！" : "Message Sent!");
                form.reset();
            } else {
                throw new Error("Failed");
            }
        } catch (error) {
            console.error(error);
            showToast(L.lang_name === "日本語" ? "送信に失敗しました" : "Failed to send");
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <header className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1607016284345-c5478694085f?q=80&w=2070&auto=format&fit=crop" alt="Minecraft Landscape" className="w-full h-full object-cover transform scale-105 animate-float" style={{ animationDuration: '20s' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://github.com/NANTETU/Nantetu-Server/blob/main/images/banner.jpg?raw=true"; }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/50 to-gray-900"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl whitespace-pre-line animate-fade-in-up transition-all duration-700">
                        {L.home.hero_title.split('\n')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 animate-pulse">{L.home.hero_title.split('\n')[1]}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium whitespace-pre-line leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>{L.home.hero_subtitle}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button onClick={() => scrollToSection('join')} className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-lg font-black rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_20px_30px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2"><Gamepad2 size={24} />{L.home.join_now}</span>
                            <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                        </button>
                        <button onClick={() => scrollToSection('about')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-lg font-bold rounded-full transition-all flex items-center gap-2 hover:scale-105">
                            <HelpCircle size={24} />{L.home.see_details}
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { val: "150+", label: L.home.stat_cumulative_players, icon: Users, color: "text-blue-500" },
                        { val: "70%", label: L.home.stat_retention_rate, icon: CheckCircle, color: "text-green-500" },
                        { val: "99.9%", label: L.home.stat_uptime, icon: Server, color: "text-purple-500" },
                        { val: "15+", label: L.home.stat_max_online, icon: Zap, color: "text-yellow-500" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <stat.icon className={`${stat.color} mb-3 transform group-hover:scale-110 transition-transform`} size={32} />
                            <div className="text-3xl font-black text-gray-800 dark:text-white mb-1">{stat.val}</div>
                            <div className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-32 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative z-10">
                            <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6"><Server size={32} /></div>
                            <h2 className="text-4xl font-black mb-8 dark:text-white leading-tight">{L.home.what_is_nantetsu}</h2>
                            <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                <p className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-4 border-purple-500">
                                    <strong className="text-purple-600 dark:text-purple-400 block text-xl mb-2">{L.home.description_p1}</strong>{L.home.description_p2}
                                </p>
                                <p>{L.home.description_p3}</p>
                                <button onClick={() => navigate('news')} className="group flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mt-4 px-6 py-3 rounded-full bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all w-fit">
                                    <Bell size={18} className="group-hover:rotate-12 transition-transform" /> {L.home.see_news}
                                </button>
                            </div>
                        </div>
                        {/* ... (Images omitted for brevity, keeping layout) ... */}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-gray-50 dark:bg-gray-900/50 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl font-black mb-16 inline-block relative dark:text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">{L.home.stats_title}</span>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-purple-500 rounded-full"></div>
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
                    {/* Quiz UI Block */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-16 border border-purple-100 dark:border-gray-700 relative overflow-hidden text-center">
                        {/* Quiz logic rendered here based on quizState prop... */}
                        {!quizState.started ? (
                            <div className="animate-fade-in relative z-10">
                                <h3 className="text-3xl font-black mb-6 dark:text-white">{L.home.quiz_title}</h3>
                                <button onClick={() => setQuizState({ ...quizState, started: true })} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all">{L.home.quiz_start}</button>
                            </div>
                        ) : (
                            // Simplified for brevity in file split, real code follows full logic
                            <div className="animate-fade-in relative z-10">
                                {quizState.finished ? (
                                    <div>
                                        <h3 className="text-3xl font-black mb-2 dark:text-white">{L.home.quiz_done}</h3>
                                        <p className="text-2xl font-bold mb-8 text-purple-600 dark:text-purple-400">{L.home.quiz_score(quizState.score, QUIZ_DATA.length)}</p>
                                        <button onClick={resetQuiz} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-xl font-bold">{L.home.quiz_retry}</button>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold mb-10 dark:text-white">{QUIZ_DATA[quizState.current].question}</h4>
                                        <div className="grid gap-4">
                                            {QUIZ_DATA[quizState.current].options.map((opt, idx) => (
                                                <button key={idx} onClick={() => !quizState.showResult && handleQuizAnswer(opt)} disabled={quizState.showResult} className={`w-full p-6 rounded-2xl text-left font-bold border-2 transition-all ${quizState.showResult ? opt === QUIZ_DATA[quizState.current].answer ? "bg-green-100 border-green-500" : "opacity-50" : "bg-white dark:bg-gray-700 hover:border-purple-500"}`}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
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
                                <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="name" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white" placeholder={L.home.contact_placeholder_name} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_email}</label>
                                <div className="relative"><MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white" placeholder={L.home.contact_placeholder_email} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_message}</label>
                                <textarea name="message" rows="5" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none" placeholder={L.home.contact_placeholder_msg} required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"><Send size={20} />{L.home.contact_send}</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}