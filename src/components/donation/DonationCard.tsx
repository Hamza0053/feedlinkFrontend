import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation, DonationStatus } from '../../types/donation';
import { Badge } from '../ui/Badge';
import { UrgencyBadge } from './UrgencyBadge';
import {
  MapPin,
  Clock,
  Package,
  Sparkles,
  Pencil,
  Trash2,
  Utensils,
  Leaf,
  Timer,
  ArrowUpRight,
  Building2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

interface DonationCardProps {
  donation: Donation;
  onEdit?: (donation: Donation) => void;
  onDelete?: (donation: Donation) => void;
}

const statusConfig: Record<
  DonationStatus,
  { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'; label: string }
> = {
  pending: { variant: 'default', label: 'Pending' },
  analyzing: { variant: 'info', label: 'Analyzing' },
  matched: { variant: 'primary', label: 'Matched' },
  claimed: { variant: 'info', label: 'Claimed' },
  pickup_scheduled: { variant: 'warning', label: 'Pickup Ready' },
  in_transit: { variant: 'warning', label: 'In Transit' },
  delivered: { variant: 'success', label: 'Delivered' },
  completed: { variant: 'success', label: 'Completed' },
  expired: { variant: 'danger', label: 'Expired' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
  available: { variant: 'primary', label: 'Available' },
};

const categoryIconMap: Record<string, React.ReactNode> = {
  prepared_meals: <Utensils size={15} className="text-amber-600" />,
  fresh_produce: <Leaf size={15} className="text-emerald-600" />,
  packaged_goods: <Package size={15} className="text-blue-600" />,
  bakery: <Utensils size={15} className="text-orange-600" />,
  dairy: <Package size={15} className="text-indigo-600" />,
  beverages: <Utensils size={15} className="text-cyan-600" />,
  other: <Package size={15} className="text-gray-600" />,
};

const categoryBgMap: Record<string, string> = {
  prepared_meals: 'bg-amber-50 border-amber-100',
  fresh_produce: 'bg-emerald-50 border-emerald-100',
  packaged_goods: 'bg-blue-50 border-blue-100',
  bakery: 'bg-orange-50 border-orange-100',
  dairy: 'bg-indigo-50 border-indigo-100',
  beverages: 'bg-cyan-50 border-cyan-100',
  other: 'bg-gray-50 border-gray-100',
};

const categoryLabels: Record<string, string> = {
  prepared_meals: 'Prepared Meals',
  fresh_produce: 'Produce',
  packaged_goods: 'Packaged',
  bakery: 'Bakery',
  dairy: 'Dairy',
  beverages: 'Beverages',
  other: 'Other',
};

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const status = statusConfig[donation.status] || statusConfig.pending;

  const isRecommendedForMe = user?.role === 'ngo' && donation.matchedNgoId === user.id;
  const canEdit = !['claimed', 'pickup_scheduled', 'in_transit', 'delivered', 'completed'].includes(
    donation.status
  );
  const canDelete = !['claimed', 'pickup_scheduled', 'in_transit'].includes(donation.status);

  // Shelf life countdown calculation
  const expiryDate = new Date(donation.expiryDate);
  const isExpired = expiryDate.getTime() < Date.now();
  const hoursRemaining = Math.max(
    0,
    Math.round((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60))
  );

  const categoryIcon = categoryIconMap[donation.foodCategory] || <Package size={15} className="text-gray-600" />;
  const categoryBg = categoryBgMap[donation.foodCategory] || 'bg-gray-50 border-gray-100';
  const categoryLabel = categoryLabels[donation.foodCategory] || donation.foodCategory;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs hover:shadow-xl hover:border-primary-300 hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
      onClick={() => navigate(`/donations/${donation.id}`)}
    >
      {/* Top Subtle Ambient Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Category Avatar */}
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${categoryBg}`}
              title={categoryLabel}
            >
              {categoryIcon}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors leading-tight">
                {donation.title}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                <Building2 size={11} className="text-gray-400 shrink-0" />
                <span className="truncate">{donation.donorName}</span>
              </p>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <UrgencyBadge level={donation.urgencyLevel} size="sm" />

            {/* Donor Edit Button */}
            {onEdit && canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(donation);
                }}
                className="p-1.5 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit Donation"
              >
                <Pencil size={13} />
              </button>
            )}

            {/* Donor Delete Button */}
            {onDelete && canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(donation);
                }}
                className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Donation"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
          {donation.description || 'No additional description provided.'}
        </p>

        {/* Food Spec Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {/* Quantity Chip */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-800">
            <Package size={12} className="text-primary-600" />
            <span>{donation.quantity}</span>
            <span className="text-gray-400 font-normal">{donation.unit}</span>
          </span>

          {/* City Chip */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600">
            <MapPin size={12} className="text-gray-400" />
            <span className="truncate max-w-[110px]">{donation.pickupCity}</span>
          </span>

          {/* Shelf Life / Expiry Chip */}
          {isExpired ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-700">
              <Timer size={12} />
              Expired
            </span>
          ) : hoursRemaining <= 12 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800">
              <Timer size={12} className="text-amber-600" />
              {hoursRemaining}h left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-500">
              <Clock size={12} className="text-gray-400" />
              {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <Badge variant={status.variant} size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 opacity-75" />
            {status.label}
          </Badge>

          {/* Recommended for current NGO */}
          {isRecommendedForMe && ['pending', 'analyzing', 'matched'].includes(donation.status) && (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0 animate-pulse">
              <Sparkles size={10} className="text-emerald-600" /> Matched for You
            </span>
          )}
        </div>

        {/* Right Info: Match Score or View Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {donation.matchScore != null && donation.matchScore > 0 ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
              <Sparkles size={10} className="text-emerald-600" />
              {donation.matchScore}%
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-400 group-hover:text-primary-600 transition-colors flex items-center gap-0.5">
              Details
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
