import React from 'react';
import { Terminal } from 'lucide-react';

export const CommandsPage = ({ L }) => (
    <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/30 rounded-3xl mb-6 text-purple-600 dark:text-purple-400 shadow-inner"><Terminal size={48} /></div>
            <h2 className="text-4xl font-black mb-4 dark:text-white">{L.commands.title}</h2>
        </div>
        <div className="grid gap-16">
            {L.commands.sections.map((section, idx) => (
                <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700"><h3 className={`text-2xl font-bold ${section.color}`}>{section.category}</h3></div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {section.commands.map((cmd, cIdx) => (
                            <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-lg group">
                                <div className="flex justify-between items-start gap-4 mb-3"><code className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-gray-700 w-full block truncate">{cmd.cmd}</code></div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-1">{cmd.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
