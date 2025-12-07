import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage = ({ L }) => {
    const title = L.terms?.title || "利用規約";
    const subtitle = L.terms?.subtitle || "当サーバーを利用する上でのルール";
    const chapters = L.terms?.chapters || [];

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <FileText className="text-purple-500" size={40} />
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                {L.terms?.date && <p className="text-sm text-gray-400 mt-2">{L.terms.date}</p>}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8 md:p-12 space-y-12">
                    {chapters.map((chapter, index) => (
                        <div key={index}>
                            <h3 className="text-2xl font-black mb-6 pb-2 border-b-2 border-purple-100 dark:border-gray-700 text-gray-900 dark:text-white">
                                {chapter.title}
                            </h3>
                            <div className="space-y-6">
                                {chapter.articles.map((article, aIdx) => (
                                    <div key={aIdx}>
                                        <h4 className="text-lg font-bold mb-2 text-purple-700 dark:text-purple-400">{article.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-200 dark:border-gray-700">{article.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-gray-800 dark:text-white">{L.terms?.signature}</p>
                </div>
            </div>
        </div>
    );
};
