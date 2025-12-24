import React from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Copy, ArrowRight, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { LANGUAGES } from '../data/languages';

// --- Loading & Notifications ---

export const LoadingScreen = () => (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col items-center justify-center animate-fade-out pointer-events-none">
        <div className="text-center">
             <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-bounce">
                <img src="https://raw.githubusercontent.com/NANTETU/Nantetu-Server/refs/heads/main/images/icon.jpg" alt="Loading" className="w-16 h-16 rounded-full object-cover" />
             </div>
             <h1 className="text-white text-2xl font-bold tracking-wider mb-4">Nantetu Server</h1>
             <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
                 <div className="h-full bg-purple-500 animate-progress"></div>
             </div>
        </div>
    </div>
);

export const LoadingBar = ({ isLoading }) => (
    <div className={`fixed top-0 left-0 w-full h-1 z-[10000] transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        {isLoading && <div className="h-full bg-purple-600 animate-progress shadow-[0_0_10px_rgba(147,51,234,0.7)]"></div>}
    </div>
);

export const Toast = ({ message }) => (
  <div className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up z-50 border-l-4 border-purple-500 ring-1 ring-black/5">
    <CheckCircle size={20} className="text-green-500" />
    <span className="font-bold">{message}</span>
  </div>
);

// --- Cards & Content Blocks ---

export const FeatureCard = ({ icon: Icon, title, description, colorClass, bgClass, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-panel p-8 rounded-2xl transition-all duration-500 hover:shadow-2xl group relative overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-2' : 'hover:-translate-y-1'}`}
  >
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${bgClass} bg-opacity-20 shadow-inner relative z-10`}>
      <Icon size={32} className={`${colorClass} transform group-hover:scale-110 transition-transform duration-300`} />
    </div>
    <h3 className="text-xl font-black mb-3 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-800 dark:group-hover:text-gray-200">{description}</p>
    {onClick && (
        <div className="mt-4 flex items-center text-sm font-bold text-purple-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Details <ArrowRight size={14} className="ml-1" />
        </div>
    )}
  </div>
);

export const CopyBox = ({ label, value, onCopy, lang }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-md">
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          {label}
      </p>
      <p className="font-mono text-xl font-bold text-gray-800 dark:text-gray-100 select-all break-all group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">{value}</p>
    </div>
    <button 
      onClick={() => onCopy(value)}
      className="flex-shrink-0 flex items-center justify-center gap-2 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 px-4 py-2 rounded-lg transition-all font-bold text-sm whitespace-nowrap active:scale-95"
    >
      <Copy size={16} />
      {LANGUAGES[lang].footer.copy_success ? 'コピー' : 'Copy'}
    </button>
  </div>
);

export const AccordionItem = ({ title, content, isOpen, toggle }) => (
  <div className={`border border-gray-200 dark:border-gray-700 rounded-xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg ring-2 ring-purple-500/20 border-purple-500/50' : 'shadow-sm hover:shadow-md bg-white dark:bg-gray-800'}`}>
    <button 
      onClick={toggle}
      className={`w-full flex items-center justify-between p-5 text-left font-bold text-lg transition-colors ${isOpen ? 'bg-purple-600 text-white' : 'text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
    >
      <span className="flex items-center gap-3">
          {isOpen && <Sparkles size={18} className="animate-pulse" />}
          {title}
      </span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
       <div className="p-6 bg-gray-50 dark:bg-gray-900/80 backdrop-blur-sm">
          {Array.isArray(content) ? (
             <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
               {content.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1.5 flex-shrink-0">
                        <CheckCircle size={16} />
                    </span>
                    <span>{item}</span>
                 </li>
               ))}
             </ul>
          ) : (
             <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</div>
          )}
       </div>
    </div>
  </div>
);

export const NewsItem = ({ item, L }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${isOpen ? 'ring-2 ring-purple-500/20' : ''}`}
    >
       <div className="p-8">
         <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${item.type === 'maintenance' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                {item.type === 'maintenance' ? L.news.maintenance : L.news.info}
              </span>
              <span className="text-gray-400 text-sm font-bold flex items-center gap-2"><Clock size={14} /> {item.date}</span>
            </div>
            <div className="text-gray-300 group-hover:text-purple-500 transition-colors self-end md:self-center">
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
         </div>
         
         <h3 className="text-2xl font-bold mb-4 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h3>
         
         {/* Content with line clamp */}
         <div className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${isOpen ? 'line-clamp-none' : 'line-clamp-2'}`}>
            {item.content}
         </div>

         {/* Action buttons (Link) - Visible only when expanded */}
         <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
             {item.url && (
                 <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the link
                    className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg"
                 >
                     {L.news.link_text} <ExternalLink size={16} />
                 </a>
             )}
         </div>
       </div>
    </div>
  );
};