import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';
import { DonationList } from '../../components/donation/DonationList';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  ShoppingBag,
  HandHeart,
  Truck,
  CheckCircle,
  MapPin,
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donations, isLoading } = useDonations(user?.id, 'ngo');
  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'completed'>(
    'available'
  );

  const availableDonations = donations.filter((d) =>
    ['pending', 'analyzing', 'matched'].includes(d.status)
  );
  const claimedDonations = donations.filter((d) =>
    ['claimed', 'pickup_scheduled', 'in_transit'].includes(d.status)
  );
  const completedDonations = donations.filter((d) =>
    ['delivered', 'completed'].includes(d.status)
  );

  const tabs = [
    { key: 'available' as const, label: 'Available', count: availableDonations.length },
    { key: 'claimed' as const, label: 'Claimed', count: claimedDonations.length },
    { key: 'completed' as const, label: 'Completed', count: completedDonations.length },
  ];

  const getCurrentDonations = () => {
    switch (activeTab) {
      case 'available':
        return availableDonations;
      case 'claimed':
        return claimedDonations;
      case 'completed':
        return completedDonations;
    }
  };

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

      {/* Tabbed Donations List */}
      <Card>
        <CardHeader
          title="Donations"
          action={
            <div className="flex bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs text-gray-400">
                    ({tab.count})
                  </span>
                </button>
              ))}
            </div>
          }
        />
        <DonationList
          donations={getCurrentDonations()}
          isLoading={isLoading}
          emptyTitle={
            activeTab === 'available'
              ? 'No available donations'
              : activeTab === 'claimed'
              ? 'No claimed donations'
              : 'No completed donations'
          }
          emptyDescription={
            activeTab === 'available'
              ? 'New donations will appear here when they become available.'
              : activeTab === 'claimed'
              ? 'Claim a donation to see it here.'
              : 'Complete a pickup to see it here.'
          }
          emptyAction={
            activeTab === 'available' ? (
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Refresh
              </Button>
            ) : undefined
          }
        />
      </Card>
    </div>
  );
};
