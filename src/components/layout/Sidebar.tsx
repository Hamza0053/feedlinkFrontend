import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Avatar } from '../ui/Avatar';
import {
  Leaf,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Bell,
  LogOut,
  X,
  Shield,
  HeartHandshake,
  Package,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const role = user?.role || 'donor';

  // Define navigation items dynamically based on user role
  const navItems = [
    {
      label: 'Dashboard',
      path: role === 'admin' ? '/admin/dashboard' : '/dashboard',
      icon: LayoutDashboard,
      show: true,
      exact: true,
    },
    {
      label: 'My Donations',
      path: '/donations',
      icon: Package,
      show: role === 'donor',
      exact: true,
    },
    {
      label: 'Create Donation',
      path: '/donations/new',
      icon: PlusCircle,
      show: role === 'donor',
      badge: 'New',
    },
    {
      label: 'Browse Donations',
      path: '/donations',
      icon: HeartHandshake,
      show: role === 'ngo',
      exact: true,
    },
    {
      label: 'Platform Admin',
      path: '/admin/dashboard',
      icon: Shield,
      show: role === 'admin',
    },
    {
      label: 'Impact & Analytics',
      path: '/impact',
      icon: BarChart3,
      show: true,
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      show: true,
      badgeCount: unreadCount,
    },
  ].filter((item) => item.show);

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin':
        return 'Admin Console';
      case 'ngo':
        return 'NGO Receiver Hub';
      case 'donor':
      default:
        return 'Food Donor Portal';
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'ngo':
        return 'bg-blue-100 text-blue-700';
      case 'donor':
      default:
        return 'bg-primary-100 text-primary-700';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-hidden"
            onClick={onClose}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xs">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                FeedLink <span className="text-primary-600">AI</span>
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Role Header */}
        <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Workspace
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${getRoleBadgeColor()}`}
            >
              {role === 'ngo' ? 'NGO' : role}
            </span>
          </div>
          <p className="text-xs text-gray-700 font-medium mt-1 truncate">
            {getRoleLabel()}
          </p>
        </div>

        {/* Quick Action Button for Donors */}
        {role === 'donor' && (
          <div className="px-4 pt-4">
            <Link
              to="/donations/new"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-xs hover:from-primary-700 hover:to-emerald-700 transition-all active:scale-[0.99]"
            >
              <PlusCircle size={16} />
              <span>Donate Food</span>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                  active
                    ? 'bg-primary-50 text-primary-800 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      active
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {/* Badge Count */}
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full shrink-0">
                    {item.badgeCount > 9 ? '9+' : item.badgeCount}
                  </span>
                )}

                {/* Simple Label Badge */}
                {item.badge && !item.badgeCount && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary-100 text-primary-700 rounded-md shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer User Profile & Sign Out */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-100 shadow-2xs mb-2">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.organization || user?.email || 'Logged in'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-lg transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
