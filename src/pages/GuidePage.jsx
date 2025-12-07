import React from 'react';
import { BookOpen, HelpCircle, Sparkles, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';

// AccordionItem component used by GuidePage
const AccordionItem = ({ title, content, isOpen, toggle }) => (
    <div className={`border rounded-xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg ring-2 ring-purple-500/20 border-purple-500 bg-white dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-white/50 dark:bg-gray-800/50'}`}>
        <button
            onClick={toggle}
            className={`w-full flex items-center justify-between p-5 text-left font-bold text-lg transition-colors ${isOpen ? 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10' : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750'}`}
        >
            <span className="flex items-center gap-3">
                {isOpen ? <Sparkles size={18} className="text-purple-500 animate-pulse" /> : <HelpCircle size={18} className="text-gray-400" />}
                {title}
            </span>
            {isOpen ? <ChevronUp size={20} className="text-purple-500" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                {Array.isArray(content) ? (
                    <ul className="space-y-3">
                        {content.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1 flex-shrink-0 bg-purple-100 dark:bg-purple-900/50 rounded-full p-0.5">
                                    <CheckCircle size={14} />
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>{content}</div>
                )}
            </div>
        </div>
    </div>
);

export const GuidePage = ({ L, activeAccordion, setActiveAccordion }) => (
    <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white tracking-tight flex justify-center items-center gap-4"><BookOpen className="text-purple-500 hidden sm:block" size={48} />{L.guide.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
        </div>
        <div className="mb-24 relative">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center relative inline-block left-1/2 transform -translate-x-1/2">
                {L.guide.steps_title}
                <div className="absolute -bottom-4 left-0 w-full h-1 bg-purple-500 rounded-full opacity-50"></div>
            </h3>
            <div className="space-y-12">
                {L.guide.steps.map((item, index) => (
                    <div key={item.step} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                        <div className="flex-1 w-full"><div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-purple-400 transition-colors relative group"><div className="absolute top-0 left-0 w-2 h-full bg-purple-500 rounded-l-3xl group-hover:bg-purple-400 transition-colors"></div><h4 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h4><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p></div></div>
                        <div className="relative flex-shrink-0"><div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-xl z-10 relative ring-8 ring-gray-50 dark:ring-gray-900">{item.step}</div></div>
                        <div className="flex-1 hidden md:block"></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10 dark:text-white flex items-center justify-center gap-3"><HelpCircle size={32} className="text-yellow-500" />{L.guide.faq_title}</h3>
            <div className="space-y-4">
                {L.guide.faq_data.map((faq, idx) => (<AccordionItem key={idx} title={faq.q} content={faq.a} isOpen={activeAccordion === `faq-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `faq-${idx}` ? null : `faq-${idx}`)} />))}
            </div>
        </div>
    </div>
);
