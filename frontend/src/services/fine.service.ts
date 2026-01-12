import axios from 'axios';
import type { Fine, CreateFineDto } from '../types/fine.types';

const API_URL = 'http://localhost:3000/api/fines';

export const FineService = {
    getAllByMoto: async (motoId: number): Promise<Fine[]> => {
        const response = await axios.get(`${API_URL}/${motoId}`);
        return response.data;
    },

    create: async (data: CreateFineDto): Promise<Fine> => {
        console.log('Sending Fine Data:', data);
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreateFineDto>): Promise<Fine> => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
