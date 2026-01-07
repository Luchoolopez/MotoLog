import apiClient from '../types/apiClient';
import type { CreateItemDto, ItemPlan } from '../types/item.types';

export const ItemService = {
    create: async (data: CreateItemDto): Promise<ItemPlan> => {
        const response = await apiClient.post('/items', data);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/items/${id}`);
    },

    getByPlan: async (planId: number): Promise<ItemPlan[]> => {
        const response = await apiClient.get(`/items/plan/${planId}`);
        return response.data.data;
    },

    getById: async (id: number): Promise<ItemPlan> => {
        const response = await apiClient.get(`/items/${id}`);
        return response.data.data;
    }
};