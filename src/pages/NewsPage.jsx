import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { NewsItem } from '../components';
import { formatCorrectedDate } from '../utils/helpers';

export const NewsPage = ({ L, newsData }) => {
    const displayData = (newsData && newsData.length > 0) ? newsData : (L.news.default_data || []);
    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3">
                    <Bell className="text-purple-500" size={40} />
                    {L.news.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
            </div>
            <div className="space-y-6">
                {displayData.map((item) => (
                    <NewsItem key={item.id} item={item} L={L} />
                ))}
                {displayData.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-gray-400">
                        お知らせはありません。
                    </div>
                )}
            </div>
        </div>
    );
};

export const NewsDetail = ({ L, id, newsData, navigate }) => {
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (newsData) {
            const found = newsData.find(i => String(i.id) === String(id));
            setItem(found);
        }
    }, [newsData, id]);

    if (!item) return <div className="max-w-4xl mx-auto py-32 px-4 text-center">お知らせが見つかりません。</div>;

    const getTypeConfig = (type) => {
        switch (type) {
            case 'maintenance': return { label: L.news.maintenance, style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' };
            case 'request': return { label: L.news.request, style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' };
            case 'explanation': return { label: L.news.explanation, style: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' };
            case 'recruitment': return { label: L.news.recruitment, style: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50' };
            case 'other': return { label: L.news.other, style: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' };
            default: return { label: L.news.info, style: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' };
        }
    };
    const config = getTypeConfig(item.type);

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
            <div className="mb-8">
                <button onClick={() => navigate('news')} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-bold">
                    <ArrowRight size={18} className="rotate-180" /> {L.news.title}に戻る
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                    <span className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider w-fit border ${config.style}`}>
                        {config.label}
                    </span>
                    <span className="text-gray-400 font-bold flex items-center gap-2"><Clock size={16} /> {formatCorrectedDate(item.date)}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-8 dark:text-white leading-tight">{item.title}</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                        {item.content}
                    </ReactMarkdown>
                </div>
                {item.url && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                            {L.news.link_text} <ExternalLink size={20} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};
