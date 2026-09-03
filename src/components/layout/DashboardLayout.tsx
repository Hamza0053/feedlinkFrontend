import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Avatar } from '../ui/Avatar';
import { Menu, Bell, Leaf, Sparkles } from 'lucide-react';

export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  // Determine a clean contextual title based on route
  const getPageHeader = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) {
      return { title: 'Admin Overview', subtitle: 'Platform health & AI monitoring' };
    }
    if (path === '/donations/new') {
      return { title: 'Create Donation', subtitle: 'List surplus food for AI matching' };
    }
    if (path.startsWith('/donations/')) {
      return { title: 'Donation Details', subtitle: 'Real-time lifecycle & AI recommendations' };
    }
    if (path === '/notifications') {
      return { title: 'Notifications', subtitle: 'Stay updated on match & pickup alerts' };
    }
    if (path === '/impact') {
      return { title: 'Impact & Analytics', subtitle: 'Community redistribution metrics' };
    }
    if (user?.role === 'ngo') {
      return { title: 'Receiver Dashboard', subtitle: 'Browse AI-matched surplus food' };
    }
    return { title: 'Donor Dashboard', subtitle: 'Manage your surplus food donations' };
  };

  const headerInfo = getPageHeader();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-200">
        {/* Top App Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            {/* Mobile Brand Logo */}
            <div className="flex md:hidden items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-base">
                FeedLink <span className="text-primary-600">AI</span>
              </span>
            </div>

            {/* Desktop Contextual Title */}
            <div className="hidden md:block">
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                {headerInfo.title}
              </h2>
              <p className="text-xs text-gray-500">{headerInfo.subtitle}</p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* AI Active Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-medium">
              <Sparkles size={12} className="text-emerald-500" />
              <span>AI Engine Active</span>
            </div>

            {/* Notification Bell with Badge */}
            <Link
              to="/notifications"
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Quick Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <Avatar name={user?.name || 'User'} size="sm" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-gray-900 leading-none truncate max-w-[120px]">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-gray-500 capitalize leading-none mt-1">
                  {user?.role === 'ngo' ? 'NGO' : user?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
