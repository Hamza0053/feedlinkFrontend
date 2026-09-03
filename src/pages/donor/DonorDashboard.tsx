import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';
import { Donation } from '../../types/donation';
import { DonationList } from '../../components/donation/DonationList';
import { EditDonationModal } from '../../components/donation/EditDonationModal';
import { DeleteDonationModal } from '../../components/donation/DeleteDonationModal';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import {
  Plus,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { donations, isLoading, refresh } = useDonations(user?.id, 'donor');

  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [deletingDonation, setDeletingDonation] = useState<Donation | null>(null);

  const activeDonations = donations.filter(
    (d) => !['completed', 'expired', 'cancelled'].includes(d.status)
  );
  const completedDonations = donations.filter((d) => d.status === 'completed');
  const pendingDonations = donations.filter((d) =>
    ['pending', 'analyzing'].includes(d.status)
  );
  const urgentDonations = donations.filter(
    (d) => d.urgencyLevel === 'critical' && !['completed', 'expired'].includes(d.status)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.organization || 'Donor Dashboard'} &middot; Manage your food donations
          </p>
        </div>
        <Button onClick={() => navigate('/donations/new')}>
          <Plus size={18} className="mr-2" />
          New Donation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value={donations.length}
          icon={<Package size={24} />}
          trend={{ value: 12, isPositive: true }}
          subtitle="All time"
        />
        <StatCard
          title="Active"
          value={activeDonations.length}
          icon={<Clock size={24} />}
          subtitle="In progress"
        />
        <StatCard
          title="Completed"
          value={completedDonations.length}
          icon={<CheckCircle size={24} />}
          trend={{ value: 8, isPositive: true }}
          subtitle="This month"
        />
        <StatCard
          title="Pending Review"
          value={pendingDonations.length}
          icon={<AlertTriangle size={24} />}
          subtitle="Awaiting match"
        />
      </div>

      {/* Urgent Donations Alert */}
      {urgentDonations.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="font-semibold text-red-900">Urgent Attention Needed</h3>
          </div>
          <p className="text-sm text-red-700">
            You have {urgentDonations.length} donation(s) marked as critical urgency.
            These need immediate action to prevent food waste.
          </p>
        </div>
      )}

      {/* Recent Donations Preview */}
      <Card>
        <CardHeader
          title="Recent Donations"
          subtitle="Your latest surplus food contributions"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/donations')}
            >
              View All ({donations.length}) &rarr;
            </Button>
          }
        />
        <DonationList
          donations={donations.slice(0, 3)}
          isLoading={isLoading}
          onEdit={(donation) => setEditingDonation(donation)}
          onDelete={(donation) => setDeletingDonation(donation)}
          emptyTitle="No donations yet"
          emptyDescription="Create your first donation to start helping reduce food waste."
          emptyAction={
            <Button onClick={() => navigate('/donations/new')}>
              <Plus size={18} className="mr-2" />
              Create Donation
            </Button>
          }
        />
        {donations.length > 3 && (
          <div className="pt-4 mt-2 border-t border-gray-100 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/donations')}
            >
              View all {donations.length} donations on the My Donations page &rarr;
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Impact Summary */}
      <Card>
        <CardHeader title="Your Impact" subtitle="See the difference you're making" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-3xl font-bold text-primary-700">
              {completedDonations.length * 25}
            </p>
            <p className="text-sm text-gray-600 mt-1">Meals Provided</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-3xl font-bold text-emerald-700">
              {completedDonations.length * 15}kg
            </p>
            <p className="text-sm text-gray-600 mt-1">Food Redistributed</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-700">
              {completedDonations.length * 30}kg
            </p>
            <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
              <TrendingUp size={14} /> CO2 Saved
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Donation Modal */}
      <EditDonationModal
        isOpen={!!editingDonation}
        donation={editingDonation}
        onClose={() => setEditingDonation(null)}
        onSuccess={() => refresh()}
      />

      {/* Delete Donation Modal */}
      <DeleteDonationModal
        isOpen={!!deletingDonation}
        donation={deletingDonation}
        onClose={() => setDeletingDonation(null)}
        onSuccess={() => refresh()}
      />
    </div>
  );
};
