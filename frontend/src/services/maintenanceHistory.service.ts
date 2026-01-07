import apiClient from '../types/apiClient';

export interface CreateHistoryDto {
    moto_id: number;
    item_plan_id: number;
    fecha_realizado: string;
    km_realizado: number;
    observaciones?: string;
    consumed_items?: {
        warehouse_item_id: number;
        cantidad_usada: number;
    }[];
}

export const MaintenanceHistoryService = {
    create: async (data: CreateHistoryDto) => {
        const response = await apiClient.post('/historial', data);
        return response.data.data;
    },

    getByMotoId: async (motoId: number) => {
        const response = await apiClient.get(`/historial/moto/${motoId}`);
        return response.data.data;
    }
};
