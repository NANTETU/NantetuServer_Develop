import React from 'react';
import { Copy, CheckCircle, ChevronDown, ChevronUp, ArrowRight, Calendar } from 'lucide-react';

export const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[9999] flex flex-col items-center justify-center">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black text-purple-600">N</span>
      </div>
    </div>
    <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2 animate-pulse">NANTETU SERVER</h2>
    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading Resources...</p>
  </div>
);

export const LoadingBar = () => (
  <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-gray-200 dark:bg-gray-800">
    <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-loading-bar"></div>
  </div>
);

export const Toast = ({ msg, onClose }) => (
  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-800 dark:text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[200] border border-gray-200 dark:border-gray-700 animate-slide-up">
    {msg.type === 'error' ? (
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
    ) : (
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    )}
    <span className="font-bold">{msg.text}</span>
  </div>
);

export const FeatureCard = ({ icon: Icon, title, description, bgClass, colorClass, onClick }) => (
  <div
    onClick={onClick}
    className="group relative p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-default"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} opacity-10 rounded-bl-full transform group-hover:scale-110 transition-transform duration-500`}></div>
    <div className={`inline-flex p-4 rounded-2xl ${bgClass} bg-opacity-10 ${colorClass} mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {Icon && <Icon size={32} />}
    </div>
    <h3 className="text-2xl font-black mb-4 text-gray-800 dark:text-white leading-tight">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{description}</p>

    {onClick && (
      <div className="mt-6 flex items-center text-sm font-bold text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        Learn more <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
      </div>
    )}
  </div>
);

export const CopyBox = ({ label, value, onCopy, lang }) => (
  <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all relative overflow-hidden">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">CLICK TO COPY</span>
    </div>
    <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => onCopy(value)}>
      <code className="font-mono text-xl md:text-2xl font-black text-gray-800 dark:text-white truncate">{value}</code>
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        <Copy size={20} />
      </div>
    </div>
  </div>
);

export const AccordionItem = ({ title, content, isOpen, toggle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
    <button onClick={toggle} className="w-full flex items-center justify-between p-6 text-left font-bold text-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {title}
      <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-100 text-gray-500'}`}>
        <ChevronDown size={20} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 mt-2">
        {content}
      </div>
    </div>
  </div>
);

export const NewsItem = ({ title, date, category, content, imageUrl, onClick }) => (
  <div onClick={onClick} className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1">
    <div className="h-48 overflow-hidden relative">
      <img src={imageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 shadow-lg">
        {category}
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center text-xs text-gray-400 font-bold mb-3">
        <Calendar size={14} className="mr-1" /> {date}
      </div>
      <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{content}</p>
      <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mt-auto">
        Read Article <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);