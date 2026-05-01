import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Calendar, BarChart3, Settings, CalendarCheck, Map, BookOpen, Users } from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const adminLinks = [
    { name: 'Principal Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Resources', path: '/admin/resources', icon: <Map className="w-5 h-5" /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'Faculty Mgmt', path: '/admin/faculty', icon: <Users className="w-5 h-5" /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Library', path: '/admin/library', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Book Resource', path: '/dashboard/book', icon: <Calendar className="w-5 h-5" /> },
    { name: 'My Bookings', path: '/dashboard/my-bookings', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'Availability', path: '/dashboard/availability', icon: <Map className="w-5 h-5" /> },
    { name: 'Library', path: '/dashboard/library', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'My Attendance', path: '/dashboard/attendance', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const links = user.role === 'Admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm hidden md:block">
      <div className="p-4 h-full flex flex-col">
        <div className="space-y-1 mt-6">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
              end={link.path === '/admin' || link.path === '/dashboard'}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </div>
        
        <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium dark:text-gray-200">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
