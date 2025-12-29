import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { LANGUAGES } from '../config/languages';

export const SearchResultsPage = ({ L, searchTerm, navigate, newsData }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(true);
    const lowerSearchTerm = searchTerm.toLowerCase();

    useEffect(() => {
        const fetchResults = async () => {
            setIsSearching(true);
            const found = [];
            try {
                // 1. Languages Search
                Object.keys(LANGUAGES).forEach(langKey => {
                    const l = LANGUAGES[langKey];
                    // Guides
                    if (l.guide_data) {
                        l.guide_data.forEach(g => {
                            if (g.title.toLowerCase().includes(lowerSearchTerm) || (g.content && g.content.some(c => c.toLowerCase().includes(lowerSearchTerm)))) {
                                found.push({ type: 'guide', title: g.title, action: () => navigate('guide') });
                            }
                        });
                    }
                    // Commands
                    if (l.commands_data) {
                        l.commands_data.forEach(c => {
                            if (c.cmd.toLowerCase().includes(lowerSearchTerm) || c.desc.toLowerCase().includes(lowerSearchTerm)) {
                                found.push({ type: 'command', title: c.cmd, desc: c.desc, action: () => navigate('commands') });
                            }
                        });
                    }
                });
                // 2. News Search
                const newsToSearch = (newsData && newsData.length > 0) ? newsData : (L.news.default_data || []);
                newsToSearch.forEach(n => {
                    if (n.title.toLowerCase().includes(lowerSearchTerm) || n.content.toLowerCase().includes(lowerSearchTerm)) {
                        found.push({ type: 'news', title: n.title, date: n.date, action: () => navigate(`news/${n.id}`) });
                    }
                });
                setSearchResults(found);
            } catch (e) {
                console.error('search error', e);
            } finally {
                setIsSearching(false);
            }
        };
        if (searchTerm) fetchResults();
    }, [searchTerm, newsData, navigate, L]);

    if (isSearching) {
        return (
            <div className="py-20 text-center">
                <Loader2 className="animate-spin mx-auto text-purple-600 mb-4" size={40} />
                <p className="dark:text-white">{L.footer.search_loading || 'Searching...'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {searchResults.length > 0 ? (
                searchResults.map((r, i) => (
                    <div key={i} onClick={r.action} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-purple-500 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                                {r.type}
                            </span>
                            {r.date && <span className="text-xs text-gray-400">{r.date}</span>}
                        </div>
                        <h3 className="text-xl font-bold dark:text-white group-hover:text-purple-600 transition-colors">{r.title}</h3>
                        {r.desc && <p className="text-sm text-gray-500 mt-1">{r.desc}</p>}
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold">{L.footer.no_results || 'No results found'}</p>
                </div>
            )}
        </div>
    );
};
