import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';
import { DonationList } from '../../components/donation/DonationList';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { requirementService } from '../../services/requirementService';
import { NgoRequirement } from '../../types/requirement';
import {
  ShoppingBag,
  HandHeart,
  Truck,
  CheckCircle,
  MapPin,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donations, isLoading } = useDonations(user?.id, 'ngo');
  const [requirements, setRequirements] = useState<NgoRequirement[]>([]);

  const availableDonations = donations.filter((d) =>
    ['pending', 'analyzing', 'matched'].includes(d.status)
  );
  const claimedDonations = donations.filter((d) =>
    ['claimed', 'pickup_scheduled', 'in_transit'].includes(d.status)
  );
  const completedDonations = donations.filter((d) =>
    ['delivered', 'completed'].includes(d.status)
  );

  useEffect(() => {
    requirementService.getMyRequirements('active').then(setRequirements).catch(() => {});
  }, []);

  const activeRequirements = requirements.filter((r) => r.status === 'active');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-1">
            <MapPin size={14} />
            {user?.organization || 'NGO Dashboard'} &middot; Browse and claim food donations
          </p>
        </div>
        <Badge variant="primary" size="md">
          NGO / Receiver
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Now"
          value={availableDonations.length}
          icon={<ShoppingBag size={24} />}
          subtitle="Ready to claim"
        />
        <StatCard
          title="Claimed"
          value={claimedDonations.length}
          icon={<HandHeart size={24} />}
          subtitle="Awaiting pickup"
        />
        <StatCard
          title="In Transit"
          value={
            donations.filter((d) => d.status === 'in_transit').length
          }
          icon={<Truck size={24} />}
          subtitle="On the way"
        />
        <StatCard
          title="Completed"
          value={completedDonations.length}
          icon={<CheckCircle size={24} />}
          subtitle="Delivered"
        />
      </div>

      {/* Pickup Reminders */}
      {claimedDonations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} className="text-amber-600" />
            <h3 className="font-semibold text-amber-900">Upcoming Pickups</h3>
          </div>
          <p className="text-sm text-amber-700">
            You have {claimedDonations.length} donation(s) to pick up.
            Check the details to arrange your pickup schedule.
          </p>
        </div>
      )}

      {/* Expiring Requirements Warning */}
      {activeRequirements.filter(
        (r) => {
          const hoursLeft = (new Date(r.neededUntil).getTime() - Date.now()) / (1000 * 60 * 60);
          return hoursLeft <= 24 && hoursLeft > 0;
        }
      ).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-semibold text-amber-900">Expiring Soon</h3>
          </div>
          <p className="text-sm text-amber-700">
            {activeRequirements.filter(
              (r) => {
                const hoursLeft = (new Date(r.neededUntil).getTime() - Date.now()) / (1000 * 60 * 60);
                return hoursLeft <= 24 && hoursLeft > 0;
              }
            ).length} requirement(s) expiring within 24 hours. Consider extending or creating new ones.
          </p>
        </div>
      )}

      {/* Active Requirements */}
      <Card>
        <CardHeader
          title="My Active Requirements"
          subtitle={`${activeRequirements.length} active food need${activeRequirements.length !== 1 ? 's' : ''}`}
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/requirements')}
            >
              Manage All &rarr;
            </Button>
          }
        />
        {activeRequirements.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm mb-3">
              No active requirements. Create one to start receiving matched donations.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/requirements')}>
              Create Requirement
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRequirements.slice(0, 3).map((req) => {
              const progressPct = Math.round(
                ((req.quantityNeeded - req.remainingQuantity) / req.quantityNeeded) * 100
              );
              const hoursLeft = (new Date(req.neededUntil).getTime() - Date.now()) / (1000 * 60 * 60);
              const isExpiring = hoursLeft <= 24;

              return (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 truncate">{req.title}</span>
                      {isExpiring && (
                        <Badge variant="warning" size="sm">
                          <AlertTriangle size={10} /> Expiring
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{req.foodCategory.replace('_', ' ')}</span>
                      <span>{req.pickupCity}</span>
                      <span>{req.remainingQuantity.toFixed(0)} {req.unit} remaining</span>
                    </div>
                    <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {activeRequirements.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/requirements')}>
                  View all {activeRequirements.length} requirements &rarr;
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Available Donations Preview */}
      <Card>
        <CardHeader
          title="Available for Claim"
          subtitle="Top surplus batches ready for rescue"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/donations')}
            >
              Browse All ({availableDonations.length}) &rarr;
            </Button>
          }
        />
        <DonationList
          donations={availableDonations.slice(0, 3)}
          isLoading={isLoading}
          emptyTitle="No donations available right now"
          emptyDescription="New food donations from local donors will appear here as soon as they are submitted."
          emptyAction={
            <Button variant="secondary" onClick={() => navigate('/donations')}>
              Open Donations Marketplace
            </Button>
          }
        />
        {availableDonations.length > 3 && (
          <div className="pt-4 mt-2 border-t border-gray-100 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/donations')}
            >
              View all {availableDonations.length} available donations on the Donations page &rarr;
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
