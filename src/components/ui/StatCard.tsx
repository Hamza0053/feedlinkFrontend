import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp size={14} className="mr-0.5" />
                ) : (
                  <TrendingDown size={14} className="mr-0.5" />
                )}
                {trend.value}%
              </span>
            )}
            {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
          {icon}
        </div>
      </div>
    </div>
  );
};
