import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Home, BookOpen, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Smart Campus <span className="text-primary">Optimization</span></span>
        </Link>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            {user ? (
              <>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{user.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-medium shadow-sm hover:shadow transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
