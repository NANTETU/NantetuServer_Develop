import React from 'react';
import { Gamepad2, HelpCircle, Users, CheckCircle, Server, Zap, Shield, Clock, MessageCircle, Terminal, BookOpen, Bell, Send, User, MapPin, ExternalLink } from 'lucide-react';
import { FeatureCard, AccordionItem, CopyBox } from '../components/UI';
import { DISCORD_WEBHOOK_URL } from '../data/languages';

// --- Sub-Components specific to Home ---

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

                <div className="space-y-4 mb-10">
                    <CopyBox label={L.join.ip} value={L.server.ip} onCopy={handleCopy} />
                    <CopyBox label={L.join.port} value={L.server.port} onCopy={handleCopy} />
                </div>

                <a href={L.social.discord_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:scale-[1.02] active:scale-95">
                    <MessageCircle size={20} className="mr-3" />
                    {L.join.discord_link}
                    <ExternalLink size={16} className="ml-2" />
                </a>
            </div>

            {/* Server Status and Players */}
            <div className="lg:w-1/2 w-full glass-panel p-8 rounded-3xl shadow-xl flex flex-col space-y-6">
                <h3 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    <Server size={24} className="text-purple-500" />
                    {L.join.status_title}
                </h3>

                {serverStatus.loading ? (
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                        <span className="text-lg text-gray-700 dark:text-gray-300">
                            {L.join.status_loading}
                        </span>
                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                            <span className="text-lg text-gray-700 dark:text-gray-300">
                                {L.join.status_server}
                            </span>
                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${serverStatus.online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {serverStatus.online ? L.join.status_online : L.join.status_offline}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                            <span className="text-lg text-gray-700 dark:text-gray-300">
                                {L.join.status_players}
                            </span>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                {serverStatus.players}
                            </span>
                        </div>
                    </>
                )}

                <div className="pt-4 flex justify-end">
                    {/* ここもnavigate関数でページ遷移を呼び出す */}
                    <button onClick={() => navigate('guide')} className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2">
                        {L.join.button_guide}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50 z-0"></div>
    </section>
);

export const FeaturesSection = ({ L }) => (
    <section id="features" className="py-24 px-4 bg-gray-100 dark:bg-gray-900 animate-fade-in-scale">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-4xl font-black mb-4 dark:text-white">{L.features.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">{L.features.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    Icon={Shield}
                    title={L.features.cards[0].title}
                    description={L.features.cards[0].description}
                    color="text-green-500"
                    L={L}
                />
                <FeatureCard
                    Icon={Users}
                    title={L.features.cards[1].title}
                    description={L.features.cards[1].description}
                    color="text-yellow-500"
                    L={L}
                />
                <FeatureCard
                    Icon={Zap}
                    title={L.features.cards[2].title}
                    description={L.features.cards[2].description}
                    color="text-blue-500"
                    L={L}
                />
                <FeatureCard
                    Icon={Clock}
                    title={L.features.cards[3].title}
                    description={L.features.cards[3].description}
                    color="text-purple-500"
                    L={L}
                />
                <FeatureCard
                    Icon={Terminal}
                    title={L.features.cards[4].title}
                    description={L.features.cards[4].description}
                    color="text-pink-500"
                    L={L}
                />
                <FeatureCard
                    Icon={BookOpen}
                    title={L.features.cards[5].title}
                    description={L.features.cards[5].description}
                    color="text-red-500"
                    L={L}
                />
            </div>
        </div>
    </section>
);

export const GuideSection = ({ L, navigate, activeAccordion, setActiveAccordion }) => (
    <section id="guide" className="py-24 px-4 relative animate-fade-in-scale">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                    <HelpCircle size={32} />
                </div>
                <h2 className="text-4xl font-black mb-4 dark:text-white">{L.guide.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">{L.guide.subtitle}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/2 space-y-6">
                    {L.guide.faq_items.slice(0, 3).map((item, index) => (
                        <AccordionItem
                            key={index}
                            title={item.title}
                            content={item.content}
                            index={`faq-${index}`}
                            activeAccordion={activeAccordion}
                            setActiveAccordion={setActiveAccordion}
                        />
                    ))}
                </div>
                <div className="lg:w-1/2 space-y-6">
                    {L.guide.faq_items.slice(3).map((item, index) => (
                        <AccordionItem
                            key={index + 3}
                            title={item.title}
                            content={item.content}
                            index={`faq-${index + 3}`}
                            activeAccordion={activeAccordion}
                            setActiveAccordion={setActiveAccordion}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center mt-12">
                {/* ここもnavigate関数でページ遷移を呼び出す */}
                <button onClick={() => navigate('guide')} className="inline-flex items-center px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-95">
                    <BookOpen size={20} className="mr-3" />
                    {L.guide.button_guide}
                    <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    </section>
);


export const ContactSection = ({ L, showToast }) => {

    // Discord Webhookにデータを送信するハンドラ
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const message = form.elements.message.value;

        const payload = {
            embeds: [{
                title: L.home.contact_discord_title,
                description: message,
                color: 0x8B5CF6, // Purple
                fields: [
                    { name: L.home.contact_discord_name, value: name, inline: true },
                    { name: L.home.contact_discord_email, value: email, inline: true }
                ],
                timestamp: new Date().toISOString(),
            }]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showToast(L.home.contact_success_message);
                form.reset();
            } else {
                showToast(L.home.contact_error_message);
                console.error("Discord Webhook Error:", response.status, response.statusText);
            }
        } catch (error) {
            showToast(L.home.contact_error_message);
            console.error("Contact Form Submission Error:", error);
        }
    };

    return (
        <section id="contact" className="py-24 px-4 bg-gray-100 dark:bg-gray-900 animate-fade-in-scale">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                        <User size={32} />
                    </div>
                    <h2 className="text-4xl font-black mb-4 dark:text-white">{L.home.contact_title}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{L.home.contact_subtitle}</p>
                </div>

                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_name}</label>
                                <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="name" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white" placeholder={L.home.contact_placeholder_name} required /></div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_email}</label>
                                <div className="relative"><MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" name="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white" placeholder={L.home.contact_placeholder_email} required /></div>
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{L.home.contact_message}</label>
                            <textarea name="message" rows="5" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none" placeholder={L.home.contact_placeholder_msg} required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-95">
                            <Send size={20} className="inline mr-2" />
                            {L.home.contact_button}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

// --- Main Page Component ---
export default function HomePage({ L, serverStatus, quizState, setQuizState, resetQuiz, handleQuizAnswer, handleCopy, scrollToSection, navigate, activeAccordion, setActiveAccordion, showToast }) {

    // Quiz Logic (Simplified for Home Page Display)
    const currentQuiz = L.quiz_data[quizState.current];

    return (
        <div className="pt-16 pb-24">
            {/* Hero Section */}
            <header className="py-20 md:py-32 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 z-10 text-center md:text-left">
                        <h1 className="text-5xl md:text-6xl font-black mb-6 dark:text-white leading-tight">
                            {L.hero.title_p1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">{L.hero.title_p2}</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                            {L.hero.subtitle}
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <button onClick={() => scrollToSection('join')} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95">
                                <Gamepad2 size={20} className="mr-3" />
                                {L.hero.button_join}
                            </button>
                            <button onClick={() => scrollToSection('guide')} className="inline-flex items-center px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-95">
                                <HelpCircle size={20} className="mr-3" />
                                {L.hero.button_guide}
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 z-10 flex justify-center">
                        <div className="relative w-72 h-72 md:w-80 md:h-80 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center border-4 border-purple-300 dark:border-purple-600 animate-float">
                            <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Server Icon" className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-lg" />
                            <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping-slow"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Join Section */}
            <JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} />

            {/* Quiz Section */}
            <section id="quiz" className="py-24 px-4 relative bg-gray-50 dark:bg-gray-900 animate-fade-in-scale">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
                        <Zap size={32} />
                    </div>
                    <h2 className="text-4xl font-black mb-4 dark:text-white">{L.quiz.title}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">{L.quiz.subtitle}</p>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                        {!quizState.started && (
                            <button onClick={() => setQuizState(p => ({ ...p, started: true }))} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-95">
                                {L.quiz.start_button}
                            </button>
                        )}

                        {quizState.started && !quizState.finished && currentQuiz && (
                            <div className="space-y-6">
                                <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-2">
                                    {L.quiz.progress} {quizState.current + 1} / {L.quiz_data.length}
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white mb-6 leading-relaxed">{currentQuiz.question}</h3>
                                <div className="space-y-4">
                                    {currentQuiz.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuizAnswer(option)}
                                            disabled={quizState.showResult}
                                            className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-[1.01] active:scale-95 disabled:pointer-events-none 
                                                ${quizState.showResult
                                                    ? (option === currentQuiz.answer ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : (quizState.isCorrect === false && option === currentQuiz.selection ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'))
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                {quizState.showResult && (
                                    <p className={`mt-4 text-lg font-bold ${quizState.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {quizState.isCorrect ? L.quiz.correct : L.quiz.incorrect}
                                    </p>
                                )}
                            </div>
                        )}

                        {quizState.finished && (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-bold dark:text-white">{L.quiz.result_title}</h3>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                    {L.quiz.result_score}: <span className="text-purple-600 dark:text-purple-400 font-black text-4xl">{quizState.score}</span> / {L.quiz_data.length}
                                </p>
                                <button onClick={resetQuiz} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all">
                                    {L.quiz.retry_button}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection L={L} />

            {/* Guide/FAQ Section */}
            <GuideSection L={L} navigate={navigate} activeAccordion={activeAccordion} setActiveAccordion={setActiveAccordion} />

            {/* Contact Section */}
            <ContactSection L={L} showToast={showToast} />
        </div>
    );
}