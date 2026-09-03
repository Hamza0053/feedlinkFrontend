import { api } from './api';
import {
  ImpactStats,
  MonthlyStats,
  TopDonor,
  TopNgo,
  RecentActivity,
  AiMatchingStats,
} from '../types/stats';

export const statsService = {
  getImpact: async (): Promise<ImpactStats> => {
    const response = await api.get('/stats/impact');
    return response.data;
  },

  getMonthly: async (): Promise<MonthlyStats[]> => {
    const response = await api.get('/stats/monthly');
    return response.data.stats || response.data;
  },

  getTopDonors: async (): Promise<TopDonor[]> => {
    const response = await api.get('/stats/top-donors');
    return response.data.donors || response.data;
  },

  getTopNgos: async (): Promise<TopNgo[]> => {
    const response = await api.get('/stats/top-ngos');
    return response.data.ngos || response.data;
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const response = await api.get('/stats/activity');
    return response.data.activity || response.data;
  },

  getAiMatching: async (): Promise<AiMatchingStats> => {
    const response = await api.get('/stats/ai-matching');
    return response.data;
  },
};
