import apiClient from '../types/apiClient';
import type { MaintenancePlan, UpdatePlanDto, CreatePlanDto } from '../types/maintenancePlan';

export const PlanService = {
    
    getAll: async (): Promise<MaintenancePlan[]> => {
        const response = await apiClient.get('/planes');
        return response.data.data; 
    },

    getById: async (id: number): Promise<MaintenancePlan> => {
        const response = await apiClient.get(`/planes/${id}`);
        return response.data.data;
    },

    create: async (data: CreatePlanDto): Promise<MaintenancePlan> => {
        const response = await apiClient.post('/planes', data);
        return response.data.data;
    },

    update: async (id: number, data: UpdatePlanDto): Promise<MaintenancePlan> => {
        const response = await apiClient.put(`/planes/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/planes/${id}`);
    }
};