import React from 'react';
import { Donation } from '../../types/donation';
import { DonationCard } from './DonationCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Package } from 'lucide-react';

interface DonationListProps {
  donations: Donation[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export const DonationList: React.FC<DonationListProps> = ({
  donations,
  isLoading = false,
  emptyTitle = 'No donations yet',
  emptyDescription = 'When donations appear, they will show up here.',
  emptyAction,
}) => {
  if (isLoading) {
    return <LoadingSpinner text="Loading donations..." />;
  }

  if (donations.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-8 h-8 text-gray-400" />}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {donations.map((donation) => (
        <DonationCard key={donation.id} donation={donation} />
      ))}
    </div>
  );
};
