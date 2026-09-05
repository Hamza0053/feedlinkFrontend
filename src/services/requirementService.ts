import { api } from './api';
import { NgoRequirement, CreateRequirementData, UpdateRequirementData } from '../types/requirement';

export const requirementService = {
  // NGO creates a new requirement
  create: async (data: CreateRequirementData): Promise<NgoRequirement> => {
    const response = await api.post('/requirements', data);
    return response.data;
  },

  // NGO gets its own requirements
  getMyRequirements: async (status?: string): Promise<NgoRequirement[]> => {
    const params = status ? { status } : {};
    const response = await api.get('/requirements/my', { params });
    return response.data.requirements;
  },

  // Get all active requirements (public)
  getActive: async (): Promise<NgoRequirement[]> => {
    const response = await api.get('/requirements/active');
    return response.data.requirements;
  },

  // Get single requirement
  getById: async (id: string): Promise<NgoRequirement> => {
    const response = await api.get(`/requirements/${id}`);
    return response.data;
  },

  // Update requirement
  update: async (id: string, data: UpdateRequirementData): Promise<NgoRequirement> => {
    const response = await api.patch(`/requirements/${id}`, data);
    return response.data;
  },

  // Cancel requirement
  cancel: async (id: string): Promise<NgoRequirement> => {
    const response = await api.delete(`/requirements/${id}`);
    return response.data;
  },
};
