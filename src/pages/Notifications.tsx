import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Bell, Check, CheckCheck, Clock, Package, Truck, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'donation_created':
      case 'new_available':
        return <Package size={18} className="text-primary-600" />;
      case 'donation_matched':
      case 'donation_claimed':
        return <Check size={18} className="text-blue-600" />;
      case 'pickup_scheduled':
      case 'pickup_reminder':
        return <Truck size={18} className="text-amber-600" />;
      case 'donation_expired':
        return <AlertTriangle size={18} className="text-red-600" />;
      case 'donation_completed':
        return <CheckCheck size={18} className="text-green-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
        )}
      </div>

      <Card>
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8 text-gray-400" />}
            title="No notifications"
            description="You'll see notifications here when there are updates to your donations."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${
                  notification.read
                    ? 'hover:bg-gray-50'
                    : 'bg-primary-50/50 hover:bg-primary-50'
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link) {
                    navigate(notification.link);
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm truncate ${
                        notification.read
                          ? 'text-gray-700'
                          : 'text-gray-900 font-semibold'
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
