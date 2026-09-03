import { api } from './api';
import { Donation, CreateDonationData } from '../types/donation';

export const donationService = {
  getAll: async (): Promise<Donation[]> => {
    const response = await api.get('/donations');
    return response.data.donations;
  },

  getById: async (id: string): Promise<Donation | undefined> => {
    try {
      const response = await api.get(`/donations/${id}`);
      return response.data;
    } catch {
      return undefined;
    }
  },

  getByDonor: async (donorId: string): Promise<Donation[]> => {
    const response = await api.get('/donations', { params: { donorId } });
    return response.data.donations;
  },

  getAvailable: async (): Promise<Donation[]> => {
    const response = await api.get('/donations/available');
    return response.data.donations;
  },

  create: async (data: CreateDonationData): Promise<Donation> => {
    const response = await api.post('/donations', data);
    return response.data;
  },

  claim: async (id: string): Promise<Donation> => {
    const response = await api.post(`/donations/${id}/claim`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Donation> => {
    const response = await api.patch(`/donations/${id}/status`, { status });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDonationData>): Promise<Donation> => {
    const response = await api.put(`/donations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/donations/${id}`);
  },
};
