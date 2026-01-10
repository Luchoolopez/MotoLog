import apiClient from "../types/apiClient";

export interface LicenseInsurance {
    id: number;
    moto_id: number;
    user_id: number;
    tipo: 'Patente' | 'Seguro' | 'VTV';
    entidad: string;
    nro_documento: string;
    fecha_vencimiento: string;
    monto: number;
    cobertura?: string | null;
    cuota?: string | null;
    pagado: boolean;
    fecha_pago?: string | null;
    observaciones?: string;
    moto?: {
        marca: string;
        modelo: string;
        patente: string;
    };
}

export interface CreateLicenseInsuranceDto {
    moto_id: number;
    tipo: 'Patente' | 'Seguro' | 'VTV';
    entidad: string;
    nro_documento: string;
    fecha_vencimiento: string;
    monto: number;
    cobertura?: string | null;
    cuota?: string | null;
    pagado?: boolean;
    fecha_pago?: string | null;
    observaciones?: string;
}

export const LicenseInsuranceService = {
    getAll: async () => {
        const response = await apiClient.get<any>("/docs");
        return response.data.data || [];
    },

    getByMoto: async (motoId: number) => {
        const response = await apiClient.get<any>(`/docs/moto/${motoId}`);
        return response.data.data || [];
    },

    create: async (data: CreateLicenseInsuranceDto) => {
        const response = await apiClient.post<any>("/docs", data);
        return response.data.data;
    },

    update: async (id: number, data: Partial<CreateLicenseInsuranceDto>) => {
        const response = await apiClient.put<any>(`/docs/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete<any>(`/docs/${id}`);
        return response.data; // usually message
    }
};
