import apiClient from '../types/apiClient';

export interface FuelRecord {
    id: number;
    moto_id: number;
    fecha: string;
    litros: number;
    precio_por_litro: number;
    total: number;
    empresa: string;
    km_momento: number;
}

export interface FuelHistoryResponse {
    history: FuelRecord[];
    averageConsumption: {
        kmPerLiter: number;
        litersPerKm: number;
        litersPer100Km: number;
    };
}

export const FuelService = {
    create: async (data: Partial<FuelRecord>) => {
        const response = await apiClient.post('/fuel', data);
        return response.data.data;
    },

    getByMotoId: async (motoId: number): Promise<FuelHistoryResponse> => {
        const response = await apiClient.get(`/fuel/moto/${motoId}`);
        return response.data.data;
    },

    update: async (id: number, data: Partial<FuelRecord>) => {
        const response = await apiClient.put(`/fuel/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete(`/fuel/${id}`);
        return response.data;
    }
};
