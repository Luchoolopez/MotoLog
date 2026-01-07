import apiClient from '../types/apiClient';

export interface WarehouseItem {
    id: number;
    user_id: number;
    nro_parte: string | null;
    nombre: string;
    categoria: 'Repuesto' | 'Accesorio' | 'Sistemático';
    fecha_compra: string;
    precio_compra: number;
    lugar_compra: string | null;
    cantidad: number;
    stock_actual: number;
    modelo_moto: string | null;
    observaciones: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWarehouseItemDto {
    nro_parte?: string;
    nombre: string;
    categoria: 'Repuesto' | 'Accesorio' | 'Sistemático';
    fecha_compra: string;
    precio_compra: number;
    lugar_compra?: string;
    cantidad: number;
    modelo_moto?: string;
    observaciones?: string;
}

export const WarehouseService = {
    getAll: async (): Promise<WarehouseItem[]> => {
        const response = await apiClient.get('/warehouse');
        return response.data.data;
    },

    getById: async (id: number): Promise<WarehouseItem> => {
        const response = await apiClient.get(`/warehouse/${id}`);
        return response.data.data;
    },

    create: async (data: CreateWarehouseItemDto): Promise<WarehouseItem> => {
        const response = await apiClient.post('/warehouse', data);
        return response.data.data;
    },

    update: async (id: number, data: Partial<CreateWarehouseItemDto>): Promise<WarehouseItem> => {
        const response = await apiClient.put(`/warehouse/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/warehouse/${id}`);
    },

    getItemHistory: async (id: number, isGlobal: boolean = false): Promise<any[]> => {
        const response = await apiClient.get(`/warehouse/${id}/history`, {
            params: { global: isGlobal }
        });
        return response.data.data;
    }
};
