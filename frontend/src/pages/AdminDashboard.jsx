import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Users, AlertTriangle, TrendingUp, Calendar, Zap, Search, Plus, Edit, Trash2, CheckCircle, XCircle, LayoutDashboard, Map, BarChart3, Settings, MoreHorizontal, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const COLORS = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EF4444'];
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

import LibraryManager from './LibraryManager';
import AIChatbot from '../components/AIChatbot';

const AdminDashboard = () => (
  <div className="relative min-h-full">
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/resources" element={<ResourceMgmt />} />
      <Route path="/bookings" element={<BookingMgmt />} />
      <Route path="/faculty" element={<FacultyMgmt />} />
      <Route path="/attendance" element={<AttendanceView />} />
      <Route path="/library" element={<LibraryManager />} />
      <Route path="/settings" element={<SettingsView />} />
    </Routes>
    <AIChatbot />
  </div>
);

/* ─── OVERVIEW ─── */
const Overview = () => {
  const [data, setData] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('/api/analytics/stats'), 
      axios.get('/api/analytics/heatmap'),
      axios.get('/api/bookings')
    ])
    .then(([s, h, b]) => {
      setData({ stats: s.data, heatmap: h.data });
      setBookings(b.data.map(bk => ({ 
        id: bk._id, 
        title: `${bk.title} (${bk.resource?.name || 'Resource'})`, 
        start: new Date(bk.startTime), 
        end: new Date(bk.endTime) 
      })));
    }).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 dark:text-white animate-pulse">Loading Dashboard...</div>;

  const chart = Object.entries(data.heatmap).map(([k, v]) => ({ name: k, bookings: v }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">University Console</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time resource and academic monitoring</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/bookings" className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"><Calendar className="w-6 h-6 text-blue-600"/></Link>
          <Link to="/admin/settings" className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"><Settings className="w-6 h-6 text-gray-500"/></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MC title="Total Resources" value={data.stats.totalResources} color="blue" icon={<Map className="w-6 h-6"/>}/>
        <MC title="Active Bookings" value={data.stats.totalBookings} color="green" icon={<Calendar className="w-6 h-6"/>}/>
        <MC title="Usage Rate" value={`${data.stats.utilizationRate}%`} color="purple" icon={<TrendingUp className="w-6 h-6"/>}/>
        <MC title="Optimization" value="+12%" color="orange" icon={<Zap className="w-6 h-6"/>}/>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Booking Intensity Heatmap</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs><linearGradient id="cU" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 700}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}}/>
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', backgroundColor: '#1f2937', color: '#fff', padding: '15px'}}/>
                <Area type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={4} fill="url(#cU)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Smart Alerts</h2>
          <IR type="warning" title="High Demand" desc="Labs are 90% booked for next Friday."/>
          <IR type="info" title="System Insight" desc="Moving 2 sessions to Hall B saved 4 hours."/>
          <IR type="success" title="Health Check" desc="All campus sensors are active."/>
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group mt-4">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-1">AI Support</h3>
              <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-6">Smart Campus Assistant</p>
              <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Ask Assistant</button>
            </div>
            <Sparkles className="absolute right-[-10%] top-[-10%] w-32 h-32 opacity-10 rotate-12" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Master Schedule Overview</h2>
           <div className="flex gap-2">
             <span className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Confirmed</span>
           </div>
        </div>
        <div className="h-[700px]">
          <BigCalendar 
            localizer={localizer} 
            events={bookings} 
            startAccessor="start" 
            endAccessor="end" 
            views={['month','week','day']} 
            defaultView="week"
            onSelectEvent={e => toast.info(`Event: ${e.title}`)}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── ANALYTICS ─── */
const Analytics = () => {
  const [data, setData] = useState(null);
  useEffect(() => { axios.get('/api/analytics').then(r => setData(r.data)).catch(console.error); }, []);
  if (!data) return <div className="p-8 dark:text-white animate-pulse">Loading Analytics...</div>;

  const typeData = Object.entries(data.resourcesByType).map(([k, v]) => ({ name: k, count: v }));

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Resource Intelligence</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Peak Operational Hours</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.peakHours}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 700}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}}/>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '20px', border: 'none', backgroundColor: '#1f2937'}}/>
                <Bar dataKey="bookings" fill="#3B82F6" radius={[10, 10, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Inventory Mix</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={60} paddingAngle={5}>
                  {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── ATTENDANCE MANAGEMENT (New Added Features) ─── */
const AttendanceView = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ student: '', subject: 'Data Structures', status: 'Present', department: 'Computer Science' });

  const fetchData = async () => {
    try {
      const [r, s] = await Promise.all([axios.get('/api/attendance'), axios.get('/api/attendance/stats')]);
      setRecords(r.data);
      setStats(s.data);
      setLoading(false);
    } catch(e) { setLoading(false); }
  };

  useEffect(() => { 
    fetchData(); 
    axios.get('/api/auth/users').then(r => setUsers(r.data)).catch(()=>{});
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    try {
      await axios.put(`/api/attendance/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch(e) { toast.error('Update failed'); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/attendance', form);
      toast.success('Record added');
      setShowAdd(false);
      fetchData();
    } catch(e) { toast.error('Failed to add record'); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Attendance Control</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 transition-all active:scale-95"><Plus className="w-5 h-5"/>{showAdd ? 'Close Panel' : 'Manual Entry'}</button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border-2 border-blue-100 dark:border-blue-900/30 grid md:grid-cols-4 gap-4 animate-fade-in">
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase">Student</label>
            <select value={form.student} onChange={e=>setForm({...form, student:e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <option value="">Select Student...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase">Subject</label>
            <input value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-400 uppercase">Status</label>
            <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"><option>Present</option><option>Absent</option></select>
          </div>
          <div className="flex items-end">
             <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-black">Save Record</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <MC title="Global Avg" value="84%" color="green" icon={<CheckCircle className="w-6 h-6"/>}/>
        <MC title="Defaulters" value="14" color="orange" icon={<AlertTriangle className="w-6 h-6"/>}/>
        <MC title="Total Records" value={records.length} color="blue" icon={<Users className="w-6 h-6"/>}/>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Student Presence Log</h2>
          <div className="flex gap-2"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Click status to toggle</span></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              {['Student Name', 'Subject', 'Department', 'Date', 'Status'].map(h => <th key={h} className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{records.map(r => (
              <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-gray-900 dark:text-white">{r.student?.name || 'Unknown Student'}</div>
                  <div className="text-xs text-gray-400 font-medium">{r.student?.email}</div>
                </td>
                <td className="p-6 font-bold text-gray-600 dark:text-gray-300">{r.subject}</td>
                <td className="p-6"><span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black">{r.department}</span></td>
                <td className="p-6 text-sm text-gray-400">{format(new Date(r.date), 'MMM dd, yyyy')}</td>
                <td className="p-6">
                  <button 
                    onClick={() => toggleStatus(r._id, r.status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-90 ${r.status === 'Present' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                  >
                    {r.status}
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─── RESOURCE MGMT, BOOKING MGMT, FACULTY MGMT, SETTINGS ─── (Kept similar but enhanced styles) */
const ResourceMgmt = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Classroom', capacity: '', features: '' });
  const [editId, setEditId] = useState(null);

  const fetchResources = () => { axios.get(`/api/resources?search=${search}`).then(r => setResources(r.data)); };
  useEffect(fetchResources, [search]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, capacity: Number(form.capacity), features: form.features.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editId) { await axios.put(`/api/resources/${editId}`, payload); toast.success('Resource Updated'); }
      else { await axios.post('/api/resources', payload); toast.success('Resource Created'); }
      setShowAdd(false); setEditId(null); setForm({ name: '', type: 'Classroom', capacity: '', features: '' }); fetchResources();
    } catch (e) { toast.error(e.response?.data?.message || 'Action failed'); }
  };

  const inputClass = "w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Campus Inventory</h1>
        <button onClick={() => { setShowAdd(!showAdd); setEditId(null); setForm({ name: '', type: 'Classroom', capacity: '', features: '' }); }} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-xl flex items-center gap-2 transition-all active:scale-95"><Plus className="w-6 h-6"/>Add Space</button>
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl border-2 border-blue-100 dark:border-blue-900/30 grid md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Space Name" required className={inputClass}/>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}><option>Classroom</option><option>Lab</option><option>Seminar Hall</option><option>Library</option><option>Equipment</option></select>
          <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="Capacity" required className={inputClass}/>
          <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Features (comma separated)" className={inputClass}/>
          <div className="md:col-span-2 lg:col-span-4 flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg">Save Space</button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-10 py-3 rounded-2xl font-black">Cancel</button>
          </div>
        </form>
      )}

      <div className="relative group shadow-sm"><Search className="absolute left-6 top-4 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Fast search by space name, category or equipment..." className={`pl-16 pr-6 py-4 rounded-[1.5rem] ${inputClass}`}/></div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              {['Resource', 'Type', 'Capacity', 'Status', 'Actions'].map(h => <th key={h} className="p-6 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{resources.map(r => (
              <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="p-6 font-black text-gray-900 dark:text-white text-lg">{r.name}</td>
                <td className="p-6 font-bold text-gray-500 dark:text-gray-400">{r.type}</td>
                <td className="p-6 font-black text-blue-600">{r.capacity}</td>
                <td className="p-6"><span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${r.liveStatus === 'Free' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.liveStatus}</span></td>
                <td className="p-6"><div className="flex gap-3"><button onClick={() => setEditId(r._id)} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-5 h-5"/></button><button className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5"/></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BookingMgmt = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { axios.get('/api/bookings').then(r => setBookings(r.data)); }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Live Sessions</h1>
      <div className="grid gap-4">
        {bookings.map(b => (
          <div key={b._id} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:border-blue-300 transition-all">
            <div><h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{b.title}</h3><p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Map className="w-4 h-4 text-blue-500"/>{b.resource?.name} · {format(new Date(b.startTime), 'MMM dd, hh:mm a')}</p></div>
            <div className="flex items-center gap-6"><span className="px-6 py-2 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-[0.2em]">{b.status}</span><button className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl text-gray-400 group-hover:text-blue-600 transition-colors"><MoreHorizontal className="w-6 h-6"/></button></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FacultyMgmt = () => {
  const [faculty, setFaculty] = useState([]);
  useEffect(() => { axios.get('/api/faculty').then(r => setFaculty(r.data)); }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Faculty Intelligence</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {faculty.map(f => (
          <div key={f._id} className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:rotate-6 transition-transform">{f.name[0]}</div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{f.name}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{f.department} · {f.designation}</p>
              <div className="flex flex-wrap gap-2">{(f.courses || []).map(c => <span key={c} className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase">{c}</span>)}</div>
            </div>
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsView = () => (
  <div className="space-y-8 max-w-2xl animate-fade-in">
    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">System Config</h1>
    <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 space-y-8">
       <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase tracking-widest">Institution Name</label><input defaultValue="Smart Campus Resource Optimizer" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-lg focus:ring-4 focus:ring-blue-500/20 transition-all"/></div>
       <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Email</label><input defaultValue="admin@example.com" disabled className="w-full px-6 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 border-none font-bold text-lg text-gray-400 cursor-not-allowed"/></div>
       <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-2xl shadow-blue-500/30 active:scale-95 transition-all">Apply System Changes</button>
    </div>
  </div>
);

/* ─── HELPERS ─── */
const MC = ({ title, value, color, icon }) => {
  const c = { 
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-100 dark:border-blue-800', 
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 border-green-100 dark:border-green-800', 
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 border-purple-100 dark:border-purple-800', 
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 border-orange-100 dark:border-orange-800' 
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-6 hover:shadow-xl transition-all group">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${c[color]}`}>{icon}</div>
      <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p><h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</h3></div>
    </div>
  );
};

const IR = ({ type, title, desc }) => {
  const styles = { 
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700/50 dark:text-yellow-200', 
    success: 'border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-200', 
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-200' 
  };
  return (
    <div className={`p-6 rounded-[1.5rem] border-l-[10px] ${styles[type]} shadow-sm transition-all hover:translate-x-2`}>
      <h4 className="font-black text-sm uppercase tracking-tighter">{title}</h4>
      <p className="text-xs mt-1 font-bold opacity-80">{desc}</p>
    </div>
  );
};

export default AdminDashboard;
