import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, ArrowRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { NewsItem } from '../components/UI';

export const NewsDetail = ({ L, id, newsData, navigate }) => {
    // Logic from App.jsx
    const [item, setItem] = useState(null);

    useEffect(() => {
        if (newsData) {
            const found = newsData.find(i => String(i.id) === String(id));
            setItem(found);
        }
    }, [newsData, id]);

    if (!item) return <div className="max-w-4xl mx-auto py-32 px-4 text-center">お知らせが見つかりません。</div>;

    // Re-implement the detail view logic or use the one I saw in NewsPage.jsx earlier but adapted.
    // App.jsx NewsDetail was:
    /*
     return (
         <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
             // ...
     );
    */
    // I will use a nicer UI similar to what was in the extracted NewsPage.jsx but using the correct data.

    return (
        <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-right">
            <button onClick={() => navigate('news')} className="group mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-bold">
                <ArrowLeft className="transform group-hover:-translate-x-1 transition-transform" size={20} /> {L.news.back_to_list || "Back to List"}
            </button>
            <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    <img src={item.imageUrl || "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?q=80&w=2069&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                        <div className="flex gap-3 mb-3">
                            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{item.type}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">{item.title}</h1>
                        <div className="flex items-center text-gray-300 text-sm font-medium"><Calendar size={16} className="mr-2" /> {item.date}</div>
                    </div>
                </div>
                <div className="p-8 md:p-12 prose dark:prose-invert prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
                        img: ({ node, ...props }) => <img {...props} className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 my-8 w-full" alt={props.alt || ''} />,
                        a: ({ node, ...props }) => <a {...props} className="text-purple-600 dark:text-purple-400 hover:underline font-bold" target="_blank" rel="noopener noreferrer" />,
                        h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-black mt-12 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700" />,
                        h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-10 mb-4 text-purple-800 dark:text-purple-300" />,
                        blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-purple-500 pl-4 py-2 italic bg-gray-50 dark:bg-gray-900/50 rounded-r-lg" />,
                        code: ({ node, inline, ...props }) => <code {...props} className={`${inline ? 'bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400' : 'block bg-gray-900 text-gray-100 p-6 rounded-xl my-6 overflow-x-auto font-mono text-sm shadow-inner'}`} />,
                    }}>{item.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export const NewsPage = ({ L, newsData, navigate }) => {
    const displayData = (newsData && newsData.length > 0) ? newsData : L.news.default_data || [];

    const getTypeLabel = (type) => {
        // Simple mapping or use logic if passed
        switch (type) {
            case 'maintenance': return L.news.maintenance;
            case 'request': return L.news.request;
            case 'explanation': return L.news.explanation;
            case 'recruitment': return L.news.recruitment;
            case 'other': return L.news.other;
            default: return L.news.info;
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase mb-4 inline-block">Latest Updates</span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white">{L.news.title}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{L.news.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayData.map((item) => (
                    <NewsItem
                        key={item.id}
                        title={item.title}
                        date={item.date}
                        category={getTypeLabel(item.type)}
                        content={item.content}
                        imageUrl={item.imageUrl}
                        onClick={() => navigate(`news/${item.id}`)}
                    />
                ))}
            </div>
            <div className="mt-16 text-center">
                <button className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto">
                    Load More <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};
