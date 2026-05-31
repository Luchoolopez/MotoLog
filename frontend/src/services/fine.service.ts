import apiClient from '../types/apiClient';
import type { Fine, CreateFineDto } from '../types/fine.types';

export const FineService = {
    getAllByMoto: async (motoId: number): Promise<Fine[]> => {
        const response = await apiClient.get(`/fines/${motoId}`);
        return response.data;
    },

    create: async (data: CreateFineDto): Promise<Fine> => {
        console.log('Sending Fine Data:', data);
        const response = await apiClient.post('/fines', data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreateFineDto>): Promise<Fine> => {
        const response = await apiClient.put(`/fines/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/fines/${id}`);
    }
};
