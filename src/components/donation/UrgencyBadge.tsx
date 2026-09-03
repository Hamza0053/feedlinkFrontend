import React from 'react';
import { UrgencyLevel } from '../../types/donation';
import { AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  size?: 'sm' | 'md';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, size = 'sm' }) => {
  const config = {
    low: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: <CheckCircle size={14} />,
      label: 'Low',
    },
    medium: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      icon: <Clock size={14} />,
      label: 'Medium',
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: <AlertCircle size={14} />,
      label: 'High',
    },
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: <AlertTriangle size={14} />,
      label: 'Critical',
    },
  };

  const { bg, text, icon, label } = config[level];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${bg} ${text} ${sizeClasses}`}
    >
      {icon}
      {label}
    </span>
  );
};
