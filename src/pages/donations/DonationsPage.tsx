import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';
import { Donation } from '../../types/donation';
import { DonationList } from '../../components/donation/DonationList';
import { EditDonationModal } from '../../components/donation/EditDonationModal';
import { DeleteDonationModal } from '../../components/donation/DeleteDonationModal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Plus,
  Search,
  Package,
  HeartHandshake,
  RotateCcw,
} from 'lucide-react';

export const DonationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || 'donor';

  // For donors: loads donor's donations. For NGOs: loads all available + claimed donations.
  const { donations, isLoading, refresh } = useDonations(
    role === 'donor' ? user?.id : undefined,
    role === 'ngo' ? 'ngo' : 'donor'
  );

  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [deletingDonation, setDeletingDonation] = useState<Donation | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [statusTab, setStatusTab] = useState<string>('all');

  // Role-specific status tabs
  const tabs = useMemo(() => {
    if (role === 'donor') {
      const allCount = donations.length;
      const activeCount = donations.filter((d) =>
        ['pending', 'analyzing', 'matched'].includes(d.status)
      ).length;
      const claimedCount = donations.filter((d) =>
        ['claimed', 'pickup_scheduled', 'in_transit'].includes(d.status)
      ).length;
      const completedCount = donations.filter(
        (d) => d.status === 'completed'
      ).length;

      return [
        { key: 'all', label: 'All Donations', count: allCount },
        { key: 'active', label: 'Active / Open', count: activeCount },
        { key: 'claimed', label: 'Claimed / In Transit', count: claimedCount },
        { key: 'completed', label: 'Completed', count: completedCount },
      ];
    } else {
      // NGO tabs
      const availableCount = donations.filter((d) =>
        ['pending', 'analyzing', 'matched'].includes(d.status)
      ).length;
      const claimedCount = donations.filter((d) =>
        ['claimed', 'pickup_scheduled'].includes(d.status)
      ).length;
      const inTransitCount = donations.filter(
        (d) => d.status === 'in_transit'
      ).length;
      const completedCount = donations.filter(
        (d) => ['delivered', 'completed'].includes(d.status)
      ).length;

      return [
        { key: 'available', label: 'Available to Claim', count: availableCount },
        { key: 'claimed', label: 'Claimed / Pickup', count: claimedCount },
        { key: 'in_transit', label: 'In Transit', count: inTransitCount },
        { key: 'completed', label: 'Completed', count: completedCount },
        { key: 'all', label: 'All Records', count: donations.length },
      ];
    }
  }, [donations, role]);

  // Set default tab on first render for NGOs
  React.useEffect(() => {
    if (role === 'ngo' && statusTab === 'all') {
      setStatusTab('available');
    }
  }, [role]);

  // Filter logic
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = d.title.toLowerCase().includes(q);
        const matchesDesc = (d.description || '').toLowerCase().includes(q);
        const matchesCity = (d.pickupCity || '').toLowerCase().includes(q);
        const matchesDonor = (d.donorName || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCity && !matchesDonor) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && d.foodCategory !== selectedCategory) {
        return false;
      }

      // 3. Urgency filter
      if (selectedUrgency !== 'all' && d.urgencyLevel !== selectedUrgency) {
        return false;
      }

      // 4. Status tab filter
      if (role === 'donor') {
        if (statusTab === 'active') {
          return ['pending', 'analyzing', 'matched'].includes(d.status);
        }
        if (statusTab === 'claimed') {
          return ['claimed', 'pickup_scheduled', 'in_transit'].includes(d.status);
        }
        if (statusTab === 'completed') {
          return d.status === 'completed';
        }
      } else {
        // NGO status tab filter
        if (statusTab === 'available') {
          return ['pending', 'analyzing', 'matched'].includes(d.status);
        }
        if (statusTab === 'claimed') {
          return ['claimed', 'pickup_scheduled'].includes(d.status);
        }
        if (statusTab === 'in_transit') {
          return d.status === 'in_transit';
        }
        if (statusTab === 'completed') {
          return ['delivered', 'completed'].includes(d.status);
        }
      }

      return true;
    });
  }, [donations, searchQuery, selectedCategory, selectedUrgency, statusTab, role]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            {role === 'donor' ? (
              <>
                <Package className="text-primary-600" size={28} />
                My Food Donations
              </>
            ) : (
              <>
                <HeartHandshake className="text-primary-600" size={28} />
                Donation Marketplace
              </>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {role === 'donor'
              ? 'Track, edit, and oversee all your surplus food contributions.'
              : 'Browse available food donations, review AI matches, and claim for redistribution.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refresh()}
            className="flex items-center gap-1.5"
            title="Refresh list"
          >
            <RotateCcw size={14} />
            Refresh
          </Button>

          {role === 'donor' && (
            <Button
              size="sm"
              onClick={() => navigate('/donations/new')}
              className="flex items-center gap-1.5 shadow-2xs"
            >
              <Plus size={16} />
              Create Donation
            </Button>
          )}
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <Card className="p-4 sm:p-5">
        <div className="space-y-4">
          {/* Top: Search and Dropdowns */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  role === 'donor'
                    ? 'Search by title, description, or pickup city...'
                    : 'Search available food, donor name, or location...'
                }
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="prepared_meals">Prepared Meals</option>
              <option value="fresh_produce">Fresh Produce</option>
              <option value="packaged_goods">Packaged Goods</option>
              <option value="bakery">Bakery</option>
              <option value="dairy">Dairy</option>
              <option value="beverages">Beverages</option>
              <option value="other">Other</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Urgencies</option>
              <option value="critical">Critical Urgency</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
            </select>
          </div>

          {/* Bottom: Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-gray-100">
            {tabs.map((tab) => {
              const isActive = statusTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-primary-700 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Main Donations Grid */}
      <DonationList
        donations={filteredDonations}
        isLoading={isLoading}
        onEdit={(donation) => setEditingDonation(donation)}
        onDelete={(donation) => setDeletingDonation(donation)}
        emptyTitle={
          searchQuery
            ? 'No matching donations found'
            : role === 'donor'
            ? 'No donations in this category'
            : 'No available food donations'
        }
        emptyDescription={
          searchQuery
            ? 'Try changing your search term or clearing the active filters.'
            : role === 'donor'
            ? 'Create a new donation batch to begin redistributing surplus food.'
            : 'New surplus food donations will appear here when posted by local donors.'
        }
        emptyAction={
          role === 'donor' && !searchQuery ? (
            <Button onClick={() => navigate('/donations/new')}>
              <Plus size={16} className="mr-1.5" />
              Create Donation
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedUrgency('all');
                setStatusTab(role === 'ngo' ? 'available' : 'all');
              }}
            >
              Reset Filters
            </Button>
          )
        }
      />

      {/* Edit Donation Modal (for Donors) */}
      <EditDonationModal
        isOpen={!!editingDonation}
        donation={editingDonation}
        onClose={() => setEditingDonation(null)}
        onSuccess={() => {
          setEditingDonation(null);
          refresh();
        }}
      />

      {/* Delete Donation Modal (for Donors) */}
      <DeleteDonationModal
        isOpen={!!deletingDonation}
        donation={deletingDonation}
        onClose={() => setDeletingDonation(null)}
        onSuccess={() => {
          setDeletingDonation(null);
          refresh();
        }}
      />
    </div>
  );
};
