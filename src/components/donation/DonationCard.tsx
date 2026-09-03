import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation, DonationStatus } from '../../types/donation';
import { Badge } from '../ui/Badge';
import { UrgencyBadge } from './UrgencyBadge';
import { MapPin, Clock, Package, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DonationCardProps {
  donation: Donation;
}

const statusConfig: Record<DonationStatus, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'; label: string }> = {
  pending: { variant: 'default', label: 'Pending' },
  analyzing: { variant: 'info', label: 'Analyzing' },
  matched: { variant: 'primary', label: 'Matched' },
  claimed: { variant: 'info', label: 'Claimed' },
  pickup_scheduled: { variant: 'warning', label: 'Pickup Scheduled' },
  in_transit: { variant: 'warning', label: 'In Transit' },
  delivered: { variant: 'success', label: 'Delivered' },
  completed: { variant: 'success', label: 'Completed' },
  expired: { variant: 'danger', label: 'Expired' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
  available: { variant: 'primary', label: 'Available' },
};

export const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
  const navigate = useNavigate();
  const status = statusConfig[donation.status] || statusConfig.pending;

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 cursor-pointer transition-all duration-200"
      onClick={() => navigate(`/donations/${donation.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {donation.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{donation.donorName}</p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <UrgencyBadge level={donation.urgencyLevel} />
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {donation.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="inline-flex items-center gap-1">
          <Package size={14} />
          {donation.quantity} {donation.unit}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} />
          {donation.pickupCity}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={14} />
          {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={status.variant} size="md">
          {status.label}
        </Badge>
        <div className="flex items-center gap-2">
          {donation.matchScore != null && donation.matchScore > 0 && (
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <Sparkles size={10} />
              Match {donation.matchScore}%
            </span>
          )}
          {donation.matchedNgoName && (
            <span className="text-xs text-gray-500">
              {donation.matchedNgoName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
