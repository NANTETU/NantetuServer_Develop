import React from 'react';
import { Home } from 'lucide-react';

export const NotFoundPage = ({ L, navigate }) => (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in-scale">
        <div className="text-center">
            <div className="mb-8 text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">404</div>
            <h2 className="text-4xl font-black mb-4 dark:text-white">{L.footer.not_found_title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto">{L.footer.not_found_desc}</p>
            <button
                onClick={() => navigate('home')}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:-translate-y-1"
            >
                <Home size={20} /> {L.footer.not_found_btn}
            </button>
        </div>
    </div>
);
