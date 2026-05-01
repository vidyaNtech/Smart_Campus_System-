import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Search, MapPin, Users, CalendarCheck, Clock, Zap, BookOpen, CheckCircle, XCircle, AlertTriangle, Filter, LayoutDashboard, Map, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const UserDashboard = () => (
  <Routes>
    <Route path="/" element={<Overview />} />
    <Route path="/book" element={<BookResource />} />
    <Route path="/my-bookings" element={<MyBookings />} />
    <Route path="/availability" element={<Availability />} />
    <Route path="/library" element={<Library />} />
    <Route path="/attendance" element={<Attendance />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Routes>
);

/* ─── OVERVIEW ─── */
const Overview = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => { 
    axios.get('/api/bookings')
      .then(r => setBookings(r.data))
      .catch(() => {}); 
  }, []);

  const upcoming = bookings.filter(b => b.status === 'Confirmed' && new Date(b.startTime) > new Date());

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-primary via-indigo-600 to-blue-700 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Hi, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 max-w-xl text-xl font-bold opacity-90 leading-relaxed">Your smart campus portal is ready. Check your attendance, reserve labs, or manage your daily schedule with AI optimization.</p>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link to="/dashboard/book" className="bg-white text-primary px-10 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2">Book a Session <ChevronRight className="w-5 h-5"/></Link>
            <Link to="/dashboard/availability" className="bg-white/10 backdrop-blur-xl text-white px-10 py-4 rounded-2xl font-black border border-white/20 hover:bg-white/20 transition-all">Live Availability</Link>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[30rem] h-[30rem] bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-700"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <StatCard icon={<CalendarCheck className="w-8 h-8"/>} label="Scheduled" value={upcoming.length} color="blue" />
        <StatCard icon={<CheckCircle className="w-8 h-8"/>} label="Approvals" value={bookings.filter(b=>b.status==='Confirmed').length} color="green" />
        <StatCard icon={<Clock className="w-8 h-8"/>} label="Attendance" value="88%" color="purple" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">Your Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <div className="py-20 text-center bg-gray-50/50 dark:bg-gray-900/30 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
             <CalendarCheck className="w-20 h-20 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
             <p className="text-xl font-bold text-gray-400">No sessions scheduled for this week.</p>
             <Link to="/dashboard/book" className="mt-4 inline-block text-primary font-black uppercase tracking-widest text-xs hover:underline">Start Booking Now</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {upcoming.slice(0, 5).map(b => (
              <div key={b._id} className="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-700/40 rounded-[2rem] border-2 border-transparent hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-primary text-xl font-black group-hover:scale-110 transition-transform">{new Date(b.startTime).getDate()}</div>
                  <div>
                    <p className="text-xl font-black text-gray-900 dark:text-white">{b.title}</p>
                    <p className="font-bold text-gray-400 flex items-center gap-2 mt-1 uppercase text-xs tracking-widest"><MapPin className="w-4 h-4 text-primary"/>{b.resource?.name} · {format(new Date(b.startTime), 'hh:mm a')}</p>
                  </div>
                </div>
                <span className="px-6 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em]">{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-100 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 border-green-100 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 border-purple-100 dark:border-purple-800'
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-6 hover:shadow-xl transition-all group">
      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-4xl font-black text-gray-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );
};

/* ─── BOOK RESOURCE ─── */
const BookResource = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ resourceId: '', title: '', startTime: '', endTime: '', attendees: '' });
  const [conflict, setConflict] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [r, b] = await Promise.all([axios.get('/api/resources'), axios.get('/api/bookings')]);
      setResources(r.data);
      setBookings(b.data.map(bk => ({ 
        id: bk._id, 
        title: `${bk.title} (${bk.resource?.name || 'Space'})`, 
        start: new Date(bk.startTime), 
        end: new Date(bk.endTime) 
      })));
    } catch (e) { console.error(e); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setConflict(null); setLoading(true);
    try {
      await axios.post('/api/bookings', { ...form, attendees: Number(form.attendees) });
      toast.success('Session scheduled!');
      setForm({ resourceId: '', title: '', startTime: '', endTime: '', attendees: '' });
      fetchData();
    } catch (err) {
      if (err.response?.status === 409) {
        setConflict(err.response.data);
        toast.warning('Conflict detected!');
      } else { toast.error(err.response?.data?.message || 'Request failed'); }
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-6 py-4 rounded-[1.5rem] border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary outline-none transition-all font-bold";

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Reserve a Space</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Request Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Space Selection</label>
              <select value={form.resourceId} onChange={e => setForm({ ...form, resourceId: e.target.value })} required className={inputClass}>
                <option value="">Choose a room...</option>
                {resources.map(r => <option key={r._id} value={r._id}>{r.name} ({r.type})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Purpose</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className={inputClass} placeholder="e.g. Workshop" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Starts</label>
                <input type="datetime-local" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Ends</label>
                <input type="datetime-local" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Attendees</label>
              <input type="number" value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })} required min="1" className={inputClass} placeholder="Headcount" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-indigo-700 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 text-lg mt-4">{loading ? 'Analyzing Slot...' : 'Confirm Request'}</button>
          </form>

          {conflict && (
            <div className="mt-10 p-8 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-[2rem] animate-fade-in">
              <div className="flex items-center gap-3 mb-4 text-red-600"><AlertTriangle className="w-6 h-6"/><h3 className="font-black uppercase tracking-tighter text-xl">Room Conflict</h3></div>
              <p className="text-sm text-red-700 dark:text-red-300 mb-6 font-bold">{conflict.message}</p>
              {conflict.alternatives?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">AI Suggestions:</p>
                  {conflict.alternatives.map(a => (
                    <button key={a._id} onClick={() => { setForm({ ...form, resourceId: a._id }); setConflict(null); }} className="w-full text-left p-5 bg-white dark:bg-gray-700 rounded-2xl border-2 border-transparent hover:border-primary transition-all flex items-center justify-between group">
                      <div><span className="font-black text-gray-900 dark:text-white text-lg">{a.name}</span><span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest">{a.type} · Cap: {a.capacity}</span></div>
                      <Plus className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Campus Schedule Overview</h2>
            <div className="flex gap-2"><span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Live Feed</span></div>
          </div>
          <div className="h-[750px]">
            <BigCalendar localizer={localizer} events={bookings} startAccessor="start" endAccessor="end" views={['month', 'week', 'day']} defaultView="week" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── MY BOOKINGS ─── */
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  useEffect(() => { axios.get('/api/bookings').then(r => setBookings(r.data)); }, []);

  const handleCancel = async (id) => {
    try { await axios.put(`/api/bookings/${id}`, { status: 'Cancelled' }); toast.success('Booking Removed'); setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b)); } catch (e) { toast.error('Action failed'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const colors = { Confirmed: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700', Completed: 'bg-gray-100 text-gray-600' };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-6">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Your Reservations</h1>
        <div className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          {['all', 'Confirmed', 'Cancelled', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all ${filter === f ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-400 hover:bg-gray-100'}`}>{f === 'all' ? 'All' : f}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-6">
        {filtered.map(b => (
          <div key={b._id} className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center flex-wrap gap-6 group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center border-2 border-transparent group-hover:border-primary/20 transition-all"><CalendarCheck className="w-8 h-8 text-primary"/></div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{b.title}</p>
                <p className="font-bold text-gray-400 flex items-center gap-3 mt-1 uppercase text-xs tracking-widest"><Map className="w-4 h-4 text-primary"/>{b.resource?.name} · {format(new Date(b.startTime), 'MMM dd, hh:mm a')}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${colors[b.status] || ''}`}>{b.status}</span>
              {b.status === 'Confirmed' && <button onClick={() => handleCancel(b._id)} className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-red-500 transition-all pb-1">Revoke Request</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── AVAILABILITY ─── */
const Availability = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (typeFilter) params.set('type', typeFilter);
    axios.get(`/api/resources?${params}`).then(r => setResources(r.data));
  }, [search, typeFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Campus Resource Radar</h1>
      <div className="flex gap-6 flex-wrap">
        <div className="relative flex-1 min-w-[350px]">
          <Search className="absolute left-6 top-5 w-7 h-7 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search space name or equipment..." className="w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-primary shadow-sm transition-all font-bold" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-10 py-5 rounded-[2rem] border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-black shadow-sm outline-none cursor-pointer">
          <option value="">All Categories</option>
          <option>Classroom</option><option>Lab</option><option>Seminar Hall</option><option>Library</option><option>Equipment</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {resources.map(r => (
          <div key={r._id} className="bg-white dark:bg-gray-800 p-10 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-3xl hover:translate-y-[-8px] transition-all group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div><h3 className="font-black text-3xl text-gray-900 dark:text-white mb-2 leading-none">{r.name}</h3><span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{r.type}</span></div>
                <div className={`w-4 h-4 rounded-full shadow-lg ${r.liveStatus === 'Free' ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
              </div>
              <div className="space-y-3 mb-10">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-black flex items-center gap-3 uppercase tracking-tighter"><Users className="w-5 h-5 text-primary" />Capacity: {r.capacity} Seats</p>
                <div className="flex flex-wrap gap-2 pt-2">{(r.features || []).map(f => <span key={f} className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border border-gray-100 dark:border-gray-700">{f}</span>)}</div>
              </div>
              <Link to="/dashboard/book" className={`block text-center py-5 rounded-[1.5rem] font-black transition-all shadow-2xl active:scale-95 text-lg ${r.liveStatus === 'Free' ? 'bg-primary text-white shadow-primary/40 hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'}`}>{r.liveStatus === 'Free' ? 'Claim Slot' : 'In Use'}</Link>
            </div>
            <div className="absolute bottom-[-15%] right-[-15%] w-48 h-48 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── LIBRARY, ATTENDANCE, SETTINGS ─── */
const Library = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => { axios.get('/api/library/books').then(r => setBooks(r.data)); }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Academic Library</h1>
      <div className="grid md:grid-cols-2 gap-10">
        {books.map(b => (
          <div key={b._id} className="bg-white dark:bg-gray-800 p-12 rounded-[4rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-10 group hover:shadow-2xl transition-all">
            <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl group-hover:rotate-12 transition-transform"><BookOpen className="w-14 h-14 text-indigo-600" /></div>
            <div className="flex-1">
              <h3 className="font-black text-3xl text-gray-900 dark:text-white mb-2 leading-none">{b.title}</h3>
              <p className="text-gray-400 font-bold mb-6 uppercase text-[10px] tracking-widest">{b.author} · {b.available} Copies Available</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-500/40 transition-all inline-block active:scale-95 uppercase text-xs tracking-widest">Request Issue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Attendance = () => {
  const [records, setRecords] = useState([]);
  useEffect(() => { axios.get('/api/attendance').then(r => setRecords(r.data)); }, []);

  const subjects = records.length > 0 ? Array.from(new Set(records.map(r => r.subject))).map(sub => {
    const relevant = records.filter(r => r.subject === sub);
    const attended = relevant.filter(r => r.status === 'Present').length;
    return { name: sub, attended, total: relevant.length, pct: Math.round((attended / relevant.length) * 100) };
  }) : [
    { name: 'Data Structures', attended: 20, total: 22, pct: 91 },
    { name: 'Operating Systems', attended: 14, total: 18, pct: 78 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Your Presence Radar</h1>
      <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              {['Subject', 'Intensity Progress', 'Success Rate', 'Status'].map(h => <th key={h} className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{subjects.map(s => (
              <tr key={s.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="p-8 font-black text-gray-900 dark:text-white text-2xl tracking-tighter">{s.name}</td>
                <td className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-64 h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                      <div className={`h-full rounded-full transition-all duration-1000 ${s.pct >= 75 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: `${s.pct}%` }}></div>
                    </div>
                    <span className="text-sm font-black text-gray-700 dark:text-gray-300">{s.attended} <span className="text-gray-400 font-bold">/ {s.total} Sessions</span></span>
                  </div>
                </td>
                <td className="p-8 text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{s.pct}%</td>
                <td className="p-8"><span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md ${s.pct >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.pct >= 75 ? 'Eligible' : 'At Risk'}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Your Identity</h1>
      <div className="bg-white dark:bg-gray-800 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 p-12 space-y-8 relative overflow-hidden">
        <div className="flex items-center gap-8 relative z-10">
           <div className="w-28 h-28 rounded-[2.5rem] bg-primary flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/40">{user?.name[0]}</div>
           <div><h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{user?.name}</h3><p className="text-gray-400 font-black uppercase text-xs tracking-widest mt-2">{user?.role} Tier Account</p></div>
        </div>
        <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label><input type="text" defaultValue={user?.name || ''} className={inputClass} /></div>
        <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">University Credential</label><input type="email" defaultValue={user?.email || ''} disabled className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed font-bold" /></div>
        <button className="w-full bg-primary hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black shadow-2xl shadow-primary/30 transition-all active:scale-95 text-lg">Update Profile Settings</button>
        <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-primary/5 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
};

export default UserDashboard;
