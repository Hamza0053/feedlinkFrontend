import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Package,
  Truck,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type NotificationTab = 'all' | 'unread' | 'matches' | 'logistics';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'donation_matched':
        return {
          icon: <Sparkles size={18} className="text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-100',
          badgeText: 'AI Match',
          badgeBg: 'bg-emerald-100/80 text-emerald-800',
        };
      case 'donation_claimed':
        return {
          icon: <Check size={18} className="text-blue-600" />,
          bg: 'bg-blue-50 border-blue-100',
          badgeText: 'Claimed',
          badgeBg: 'bg-blue-100/80 text-blue-800',
        };
      case 'pickup_scheduled':
      case 'pickup_reminder':
      case 'in_transit':
        return {
          icon: <Truck size={18} className="text-amber-600" />,
          bg: 'bg-amber-50 border-amber-100',
          badgeText: 'Logistics',
          badgeBg: 'bg-amber-100/80 text-amber-800',
        };
      case 'donation_expired':
        return {
          icon: <AlertTriangle size={18} className="text-red-600" />,
          bg: 'bg-red-50 border-red-100',
          badgeText: 'Urgent',
          badgeBg: 'bg-red-100/80 text-red-800',
        };
      case 'donation_completed':
        return {
          icon: <ShieldCheck size={18} className="text-green-600" />,
          bg: 'bg-green-50 border-green-100',
          badgeText: 'Completed',
          badgeBg: 'bg-green-100/80 text-green-800',
        };
      case 'donation_created':
      case 'new_available':
      default:
        return {
          icon: <Package size={18} className="text-primary-600" />,
          bg: 'bg-primary-50 border-primary-100',
          badgeText: 'Donation',
          badgeBg: 'bg-primary-100/80 text-primary-800',
        };
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === 'unread') return !item.read;
      if (activeTab === 'matches')
        return ['donation_matched', 'donation_claimed'].includes(item.type);
      if (activeTab === 'logistics')
        return ['pickup_scheduled', 'pickup_reminder', 'in_transit', 'donation_completed'].includes(item.type);
      return true;
    });
  }, [notifications, activeTab]);

  const tabs = [
    { key: 'all' as const, label: 'All', count: notifications.length },
    { key: 'unread' as const, label: 'Unread', count: unreadCount },
    {
      key: 'matches' as const,
      label: 'Matches & Claims',
      count: notifications.filter((n) =>
        ['donation_matched', 'donation_claimed'].includes(n.type)
      ).length,
    },
    {
      key: 'logistics' as const,
      label: 'Pickup & Delivery',
      count: notifications.filter((n) =>
        ['pickup_scheduled', 'pickup_reminder', 'in_transit', 'donation_completed'].includes(n.type)
      ).length,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-50/40 via-emerald-50/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shadow-2xs">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Activity Notifications
              </h1>
              <p className="text-xs text-gray-500">
                Live updates on donation matches, claims, and delivery progress
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 self-end sm:self-auto relative z-10 text-xs font-semibold shadow-2xs"
          >
            <CheckCheck size={15} className="text-emerald-600" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification Feed Card */}
      <Card className="p-0 overflow-hidden shadow-xs">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <EmptyState
              icon={<Inbox className="w-12 h-12 text-gray-300 mx-auto mb-2" />}
              title={
                activeTab === 'unread'
                  ? 'You are all caught up!'
                  : 'No notifications found'
              }
              description={
                activeTab === 'unread'
                  ? 'There are no unread notifications right now.'
                  : 'Notifications will appear here as donations progress through matching and pickup.'
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const style = getNotificationStyle(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`group relative flex items-start gap-4 p-5 cursor-pointer transition-all duration-200 ${
                    notification.read
                      ? 'bg-white hover:bg-gray-50/80'
                      : 'bg-emerald-50/20 hover:bg-emerald-50/40 border-l-4 border-l-emerald-500'
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    if (notification.link) {
                      navigate(notification.link);
                    }
                  }}
                >
                  {/* Category / Event Icon Avatar */}
                  <div
                    className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${style.bg}`}
                  >
                    {style.icon}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${style.badgeBg}`}
                        >
                          {style.badgeText}
                        </span>
                        <h3
                          className={`text-sm tracking-tight ${
                            notification.read
                              ? 'text-gray-800 font-medium'
                              : 'text-gray-950 font-bold'
                          }`}
                        >
                          {notification.title}
                        </h3>
                      </div>

                      {/* Right Indicator / Timestamp */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>

                        {!notification.read && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
                            title="Unread"
                          />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed pr-6">
                      {notification.message}
                    </p>

                    {/* Action Bar on Item */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100/60">
                      <span className="text-[11px] font-semibold text-primary-600 group-hover:text-primary-700 flex items-center gap-1 transition-colors">
                        View details
                        <ArrowRight
                          size={12}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>

                      {!notification.read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
                        >
                          <Check size={12} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
