import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!user) return <Navigate to="/login" />;
  
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'Admin') return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Layout component to wrap authenticated pages with Sidebar
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute roles={['Student', 'Faculty', 'Staff']}>
                <AuthenticatedLayout>
                  <UserDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute roles={['Admin']}>
                <AuthenticatedLayout>
                  <AdminDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default App;
