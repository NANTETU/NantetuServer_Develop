import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Terminal, BookOpen, HelpCircle, FileText, Lock, Search, ArrowRight, Loader2, Send } from 'lucide-react';
import { NewsItem, AccordionItem, CopyBox } from '../components/UI';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../utils/firebase';

// --- News Page ---
export const NewsPage = ({ L, newsData }) => {
  const displayData = (newsData && newsData.length > 0) ? newsData : L.news.default_data;
  return (
    <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 dark:text-white flex justify-center items-center gap-3"><Bell className="text-purple-500" size={40} />{L.news.title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{L.news.subtitle}</p>
      </div>
      <div className="space-y-4">
        {displayData.map((item) => (
          <NewsItem key={item.id} item={item} L={L} />
        ))}
      </div>
    </div>
  );
};

// --- Forum Page ---
export const ForumPage = ({ L, user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'forum_posts'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error(error));
    return () => unsubscribe();
  }, [user]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;
    setIsSending(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'forum_posts'), {
        text: newPost, name: name.trim() || L.forum.anonymous, uid: user.uid, createdAt: serverTimestamp()
      });
      setNewPost('');
    } catch (error) { console.error(error); } finally { setIsSending(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-32 px-4 animate-fade-in-scale">
        <div className="text-center mb-16"><h2 className="text-4xl font-black mb-4 dark:text-white">{L.forum.title}</h2></div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-10">
            <form onSubmit={handlePost}>
                <div className="flex flex-col gap-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={L.forum.input_name} className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white" />
                    <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={L.forum.input_message} rows="3" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none dark:text-white resize-none" />
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSending || !newPost.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2">
                            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}{isSending ? L.forum.sending : L.forum.send}
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <div className="space-y-4">
            {posts.length === 0 ? <div className="text-center py-10 text-gray-500"><MessageSquare size={48} className="mx-auto mb-4 opacity-20" /><p>{L.forum.no_posts}</p></div> : posts.map(post => (<div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up"><div className="flex justify-between items-start mb-2"><span className="font-bold text-purple-600 dark:text-purple-400">{post.name}</span><span className="text-xs text-gray-400">{post.createdAt?.toDate().toLocaleString() || 'Just now'}</span></div><p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.text}</p></div>))}
        </div>
    </div>
  );
};

// --- Guide Page ---
export const GuidePage = ({ L, activeAccordion, setActiveAccordion }) => (
  <div className="max-w-5xl mx-auto py-32 px-4 animate-fade-in-scale">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white tracking-tight flex justify-center items-center gap-4"><BookOpen className="text-purple-500 hidden sm:block" size={48} />{L.guide.title}</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400">{L.guide.subtitle}</p>
    </div>
    <div className="mb-24 relative">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">{L.guide.steps_title}</h3>
        <div className="space-y-12">
            {L.guide.steps.map((item, index) => (
                <div key={item.step} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 w-full"><div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:border-purple-400 transition-colors relative group"><div className="absolute top-0 left-0 w-2 h-full bg-purple-500 rounded-l-3xl"></div><h4 className="text-xl font-bold mb-3 dark:text-white group-hover:text-purple-600 transition-colors">{item.title}</h4><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p></div></div>
                    <div className="relative flex-shrink-0"><div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-xl z-10 relative ring-4 ring-white dark:ring-gray-900">{item.step}</div></div>
                    <div className="flex-1 hidden md:block"></div>
                </div>
            ))}
        </div>
    </div>
    <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10 dark:text-white flex items-center justify-center gap-3"><HelpCircle size={32} className="text-yellow-500" />{L.guide.faq_title}</h3>
        <div className="space-y-4">
            {L.guide.faq_data.map((faq, idx) => (<AccordionItem key={idx} title={faq.q} content={faq.a} isOpen={activeAccordion === `faq-${idx}`} toggle={() => setActiveAccordion(activeAccordion === `faq-${idx}` ? null : `faq-${idx}`)} />))}
        </div>
    </div>
  </div>
);

// --- Commands Page ---
export const CommandsPage = ({ L }) => (
    <div className="max-w-6xl mx-auto py-32 px-4 animate-fade-in-scale">
      <div className="text-center mb-20">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6 text-purple-600 dark:text-purple-400"><Terminal size={40} /></div>
        <h2 className="text-4xl font-black mb-4 dark:text-white">{L.commands.title}</h2>
      </div>
      <div className="grid gap-16">
        {L.commands.sections.map((section, idx) => (
            <div key={idx} className="animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
              <div className="flex items-center gap-4 mb-8"><h3 className={`text-2xl font-bold ${section.color}`}>{section.category}</h3></div>
              <div className="grid md:grid-cols-2 gap-6">
                {section.commands.map((cmd, cIdx) => (
                  <div key={cIdx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-300 transition-all hover:shadow-md group">
                    <div className="flex justify-between items-start gap-4 mb-3"><code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-purple-700 dark:text-purple-300 rounded-lg font-mono font-bold text-sm border border-gray-200 dark:border-gray-700">{cmd.cmd}</code></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{cmd.desc}</p>
                  </div>
                ))}
              </div>
            </div>
        ))}
      </div>
    </div>
);

// --- Join Page (Wrapper) ---
import { JoinSection } from './Home'; // Reusing Join Section Logic from Home is tricky if not exported. 
// Instead of import, we can just recreate a simple wrapper or make sure Home exports it. 
// For this split, we will just pass props to Home's logic if needed, but since we have a dedicated Join view...
// Let's assume a simplified Join Page that uses the same logic or component.
export const JoinPage = ({ L, serverStatus, handleCopy, navigate }) => (
    <div className="pt-24"><JoinSection L={L} serverStatus={serverStatus} handleCopy={handleCopy} navigate={navigate} /></div>
);