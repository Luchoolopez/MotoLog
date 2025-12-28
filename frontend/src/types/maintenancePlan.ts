export interface MaintenancePlan {
    id: number;
    nombre: string;
    descripcion: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreatePlanDto {
    nombre: string;
    descripcion: string;
}

export interface UpdatePlanDto {
    nombre?: string;
    descripcion?: string;
}