import apiClient from '../types/apiClient';
import type { Motorcycle, CreateMotoDto, MaintenanceStatus } from '../types/moto.types';

export const MotoService = {
    getAll: async (): Promise<Motorcycle[]> => {
        const response = await apiClient.get('/motos');
        return response.data.data;
    },

    getById: async (id: number): Promise<Motorcycle> => {
        const response = await apiClient.get(`/motos/${id}`);
        return response.data.data;
    },

    getStatus: async (id: number): Promise<MaintenanceStatus[]> => {
        const response = await apiClient.get(`/status/${id}`);
        return response.data.data;
    },

    create: async (data: CreateMotoDto): Promise<Motorcycle> => {
        const response = await apiClient.post('/motos', data);
        return response.data.data;
    },

    updateKm: async (id: number, km: number): Promise<Motorcycle> => {
        const response = await apiClient.put(`/motos/km/${id}`, { km_actual: km });
        return response.data.data;
    },

    delete:async(id:number):Promise<void> => {
        const response = await apiClient.delete(`/motos/${id}`);
        return response.data.data;
    }
};