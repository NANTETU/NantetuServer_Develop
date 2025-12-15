import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { NewsItem } from '../components/UI';

export const SearchResultsPage = ({ query: searchQuery, L, navigate }) => {
    // Dummy link to shared data or passed props
    // In a real app, this would query a search index or filter the centralized data
    const NEWS_DATA = [
        { id: 1, title: L.news.item1_title, date: "2024.12.01", category: "Update", content: L.news.item1_content, imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" },
        { id: 2, title: L.news.item2_title, date: "2024.11.25", category: "Event", content: L.news.item2_content, imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" },
        { id: 3, title: L.news.item3_title, date: "2024.11.10", category: "Important", content: L.news.item3_content, imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop" }
    ];

    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            return;
        }
        const q = searchQuery.toLowerCase();
        const filtered = NEWS_DATA.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
        setResults(filtered);
    }, [searchQuery, L]);

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase mb-4 inline-block">Search Results</span>
                <h2 className="text-3xl md:text-5xl font-black mb-6 dark:text-white">"{searchQuery}"</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {results.length > 0 ? `Found ${results.length} matches` : 'No results found'}
                </p>
            </div>

            {results.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((item) => (
                        <NewsItem key={item.id} {...item} onClick={() => navigate(`news/${item.id}`)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-200 dark:border-gray-700">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Try different keywords or check spelling.</p>
                </div>
            )}
        </div>
    );
};
