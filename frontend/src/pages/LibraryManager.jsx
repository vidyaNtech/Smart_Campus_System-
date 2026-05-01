import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Search, Plus, Trash2, Edit, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const LibraryManager = () => {
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: 'Computing', copies: 1 });

  const fetchData = async () => {
    try {
      const [b, i] = await Promise.all([axios.get('/api/library/books'), axios.get('/api/library/issues')]);
      setBooks(b.data);
      setIssues(i.data);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/library/books', form);
      toast.success('Book added to catalog');
      setShowAdd(false);
      setForm({ title: '', author: '', isbn: '', category: 'Computing', copies: 1 });
      fetchData();
    } catch (e) { toast.error('Failed to add book'); }
  };

  const inputClass = "w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-bold";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Library Central</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Manage global campus archives</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className={`px-8 py-3 rounded-2xl font-black shadow-xl flex items-center gap-2 transition-all active:scale-95 ${showAdd ? 'bg-red-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {showAdd ? <X className="w-6 h-6"/> : <Plus className="w-6 h-6"/>}
          {showAdd ? 'Close Panel' : 'New Book'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl border-2 border-indigo-100 dark:border-indigo-900/30 grid md:grid-cols-2 lg:grid-cols-5 gap-5 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Book Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" required className={inputClass}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Author</label>
            <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Author Name" required className={inputClass}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">ISBN</label>
            <input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} placeholder="ISBN Number" required className={inputClass}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Copies</label>
            <input type="number" value={form.copies} onChange={e => setForm({...form, copies: Number(e.target.value)})} required min="1" className={inputClass}/>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95">Save to Catalog</button>
          </div>
        </form>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Active Catalog</h2>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div><span className="text-[10px] font-black uppercase text-gray-400">Live Inventory</span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  {['Title & Author', 'ISBN', 'Available', 'Status'].map(h => <th key={h} className="p-8 text-xs font-black text-gray-400 uppercase tracking-widest">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{books.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="p-8">
                      <div className="font-black text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{b.title}</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{b.author}</div>
                    </td>
                    <td className="p-8 font-mono text-xs text-gray-400">{b.isbn}</td>
                    <td className="p-8 font-black text-indigo-600 text-xl tracking-tighter">{b.available} <span className="text-xs text-gray-300 font-bold">/ {b.copies}</span></td>
                    <td className="p-8"><span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${b.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.available > 0 ? 'In Stock' : 'Loaned'}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">Recent Issues</h2>
            <div className="space-y-4">
              {issues.length === 0 ? <p className="text-center py-10 text-gray-400 font-bold">No active loans found.</p> : issues.slice(0, 8).map(i => (
                <div key={i._id} className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex justify-between items-center group border-2 border-transparent hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black">?</div>
                    <div>
                      <p className="font-black text-sm text-gray-900 dark:text-white leading-none mb-1">{i.book?.title}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{i.user?.name}</p>
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="text-2xl font-black mb-2 tracking-tighter">Inventory Health</h3>
               <div className="flex justify-between items-end mt-10">
                  <div><p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">Live Catalog</p><p className="text-5xl font-black">{books.length}</p></div>
                  <div className="text-right"><p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">Active Loans</p><p className="text-5xl font-black">{issues.filter(l=>l.status==='Issued').length}</p></div>
               </div>
             </div>
             <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryManager;
