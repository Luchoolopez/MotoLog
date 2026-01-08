import apiClient from "../types/apiClient";

export interface LicenseInsurance {
    id: number;
    moto_id: number;
    user_id: number;
    tipo: 'Patente' | 'Seguro';
    entidad: string;
    nro_documento: string;
    fecha_vencimiento: string;
    monto: number;
    cobertura?: string | null;
    cuota?: string | null;
    pagado: boolean;
    moto?: {
        marca: string;
        modelo: string;
        patente: string;
    };
}

export interface CreateLicenseInsuranceDto {
    moto_id: number;
    tipo: 'Patente' | 'Seguro';
    entidad: string;
    nro_documento: string;
    fecha_vencimiento: string;
    monto: number;
    cobertura?: string;
    cuota?: string;
    pagado?: boolean;
    observaciones?: string;
}

export const LicenseInsuranceService = {
    getAll: async () => {
        const response = await apiClient.get<LicenseInsurance[]>("/docs");
        return response.data;
    },

    getByMoto: async (motoId: number) => {
        const response = await apiClient.get<LicenseInsurance[]>(`/docs/moto/${motoId}`);
        return response.data;
    },

    create: async (data: CreateLicenseInsuranceDto) => {
        const response = await apiClient.post<LicenseInsurance>("/docs", data);
        return response.data;
    },

    update: async (id: number, data: Partial<CreateLicenseInsuranceDto>) => {
        const response = await apiClient.put<LicenseInsurance>(`/docs/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await apiClient.delete(`/docs/${id}`);
        return response.data;
    }
};
