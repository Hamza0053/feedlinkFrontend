import { useState, useEffect, useCallback } from 'react';
import { Donation, DonationStatus } from '../types/donation';
import { donationService } from '../services/donationService';

export const useDonations = (_userId?: string, role?: string) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    try {
      if (role === 'admin') {
        const all = await donationService.getAll();
        setDonations(all);
      } else if (role === 'ngo') {
        // Use getAll() which hits /donations (backend filters by NGO role)
        const ngoDonations = await donationService.getAll();
        setDonations(ngoDonations);
      } else if (role === 'donor') {
        const donorDonations = await donationService.getAll();
        setDonations(donorDonations);
      } else {
        // No user — fallback (public pages)
        const all = await donationService.getAll();
        setDonations(all);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const getByStatus = useCallback(
    (status: DonationStatus) => donations.filter((d) => d.status === status),
    [donations]
  );

  const getAvailable = useCallback(
    () => donations.filter((d) => ['available', 'matched', 'analyzing', 'pending'].includes(d.status)),
    [donations]
  );

  const getById = useCallback(
    (id: string) => donations.find((d) => d.id === id),
    [donations]
  );

  return {
    donations,
    isLoading,
    refresh: fetchDonations,
    getByStatus,
    getAvailable,
    getById,
  };
};
