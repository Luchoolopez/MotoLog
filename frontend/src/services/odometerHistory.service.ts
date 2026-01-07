import apiClient from '../types/apiClient';

export interface OdometerRecord {
    id: number;
    moto_id: number;
    km: number;
    fecha: string;
    observaciones?: string;
    createdAt: string;
    updatedAt: string;
}

export const OdometerHistoryService = {
    getByMotoId: async (motoId: number): Promise<OdometerRecord[]> => {
        const response = await apiClient.get(`/odometer-history/moto/${motoId}`);
        return response.data.data;
    }
};
