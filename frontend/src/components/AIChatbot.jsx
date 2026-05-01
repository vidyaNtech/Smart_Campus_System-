import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello Admin! I am your Smart Campus Assistant. I have analyzed current resource usage and student attendance. How can I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post('/api/ai/query', { prompt: input });
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "I encountered a synchronization error with the campus data grid. Please try again or check the dashboard directly." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[400px] h-[550px] bg-white dark:bg-gray-800 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-8 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Bot className="w-24 h-24 rotate-12" /></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
                <Sparkles className="w-6 h-6 text-yellow-300 fill-current" />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight leading-none">Campus Intelligence</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Synced with DB</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold shadow-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-600'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-700 p-5 rounded-[2rem] rounded-tl-none border border-gray-100 dark:border-gray-600 shadow-sm flex items-center gap-2">
                   <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Analyzing Data</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="relative group">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Query campus intelligence..." 
                className="w-full pl-6 pr-16 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-sm transition-all shadow-inner dark:text-white"
              />
              <button 
                type="submit" 
                disabled={isTyping || !input.trim()}
                className={`absolute right-2 top-2 p-3 rounded-xl transition-all active:scale-90 ${
                  input.trim() ? 'bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/40' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAB Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 rounded-[2rem] shadow-2xl transition-all duration-500 flex items-center gap-3 group relative overflow-hidden ${
          isOpen ? 'bg-indigo-900 rotate-90 scale-90' : 'bg-indigo-600 hover:scale-110 active:scale-95'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        {isOpen ? <X className="text-white w-8 h-8" /> : <Bot className="text-white w-8 h-8" />}
        
        {/* Pulsing Aura */}
        {!isOpen && <span className="absolute inset-0 rounded-[2rem] bg-indigo-600 animate-ping opacity-20 scale-125"></span>}
      </button>
    </div>
  );
};

export default AIChatbot;
