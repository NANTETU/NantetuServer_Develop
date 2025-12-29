import React from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Copy, ArrowRight, Sparkles, ExternalLink, Clock, HelpCircle } from 'lucide-react';
import { LANGUAGES } from '../config/languages';
import { formatCorrectedDate } from '../utils/helpers';

// --- Loading & Notifications ---

export const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950 flex flex-col items-center justify-center animate-fade-out pointer-events-none transition-opacity duration-700">
    <div className="text-center relative">
      <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse"></div>
      <div className="relative z-10 w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-purple-500/30 ring-1 ring-gray-100 dark:ring-white/10">
        <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Loading" className="w-20 h-20 rounded-xl object-cover" />
      </div>
      <h1 className="text-gray-900 dark:text-white text-3xl font-black tracking-wider mb-2 animate-fade-in-up">Nantetu Server</h1>
      <p className="text-purple-600 dark:text-purple-400 font-bold text-sm tracking-[0.2em] animate-pulse">INITIALIZING...</p>
    </div>
  </div>
);

export const LoadingBar = ({ isLoading }) => (
  <div className={`fixed top-0 left-0 w-full h-1 z-[10000] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
    {isLoading && <div className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-progress shadow-[0_0_15px_rgba(168,85,247,0.7)] w-full"></div>}
  </div>
);

export const Toast = ({ message }) => (
  <div className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in-up z-50 border-l-4 border-purple-500 ring-1 ring-black/5 max-w-sm">
    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
    </div>
    <span className="font-bold text-sm md:text-base">{message}</span>
  </div>
);

// --- Cards & Content Blocks ---

export const FeatureCard = ({ icon: Icon, title, description, colorClass, bgClass, onClick }) => (
  <div
    onClick={onClick}
    className={`glass-panel p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group relative overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-2' : 'hover:-translate-y-1'}`}
  >
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${bgClass} bg-opacity-10 dark:bg-opacity-20 shadow-inner relative z-10 ring-1 ring-white/10`}>
      <Icon size={32} className={`${colorClass} transform group-hover:scale-110 transition-transform duration-300`} />
    </div>
    <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{description}</p>
    {onClick && (
      <div className="mt-4 flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        詳細を見る <ArrowRight size={14} className="ml-1" />
      </div>
    )}
  </div>
);

export const CopyBox = ({ label, value, onCopy, lang }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyClick = () => {
    onCopy(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const L = LANGUAGES[lang];

  return (
    <div className="relative group overflow-hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] hover:border-purple-500/50">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 w-full overflow-hidden">
        <p className="text-[10px] font-black text-purple-600/60 dark:text-purple-400/60 uppercase tracking-[2px] mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          {label}
        </p>
        <p className="font-mono text-xl sm:text-2xl font-black text-gray-800 dark:text-white truncate" title={value}>
          {value}
        </p>
      </div>

      <button
        onClick={handleCopyClick}
        className={`relative z-10 flex-shrink-0 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg ${isCopied
          ? 'bg-green-500 text-white shadow-green-500/40'
          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 shadow-gray-200/50 dark:shadow-black/20'
          }`}
      >
        {isCopied ? <CheckCircle size={18} className="animate-bounce" /> : <Copy size={18} />}
        <span>
          {isCopied ? (L?.join?.copy_success || 'Copied!') : (L?.join?.copy_action || 'Copy')}
        </span>
      </button>

      {/* Hover Line Animation */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-700 ease-in-out"></div>
    </div>
  );
};

export const AccordionItem = ({ title, content, isOpen, toggle }) => (
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

export const NewsItem = ({ item, L }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${isOpen ? 'ring-2 ring-purple-500/20 shadow-lg' : ''}`}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider w-fit border ${config.style}`}>
              {config.label}
            </span>
            <span className="text-gray-400 text-sm font-bold flex items-center gap-1.5"><Clock size={14} /> {formatCorrectedDate(item.date)}</span>
          </div>
          <div className="text-gray-300 group-hover:text-purple-500 transition-colors self-end md:self-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-full">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-3 dark:text-white leading-tight">{item.title}</h3>

        <div className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 text-sm md:text-base ${isOpen ? 'line-clamp-none' : 'line-clamp-2'}`}>
          {item.content}
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-20 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.hash = `#/news/${item.id}`;
              }}
              className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              詳細を見る <ArrowRight size={16} />
            </button>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-white font-bold bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {L.news.link_text} <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};