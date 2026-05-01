import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Search, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-32 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
              Smart Campus <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Resource Optimisation Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              An intelligent, data-driven platform that revolutionises how college resources are managed, booked, and optimised. 
              Prevent scheduling conflicts, maximize utilisation, and gain actionable insights.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Intelligent Optimization Core</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our system doesn't just book rooms; it actively ensures that the right space is allocated to the right need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-2xl border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 dark:bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Search className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Conflict Resolution</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically detects double-bookings and suggests the best alternative rooms based on required capacity and features.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-gray-800 p-8 rounded-2xl border border-indigo-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="bg-indigo-600 dark:bg-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <LayoutDashboard className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data-Driven Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize resource utilization with heatmaps, track usage trends, and manage everything from a centralized panel.
              </p>
            </div>

            <div className="bg-sky-50 dark:bg-gray-800 p-8 rounded-2xl border border-sky-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="bg-sky-600 dark:bg-sky-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Predictive AI Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get actionable recommendations to minimize wasted capacity and optimize peak hour resource distribution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
