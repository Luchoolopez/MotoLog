export interface ItemPlan {
    id: number;
    plan_id: number;
    tarea: string;
    intervalo_km: number;
    intervalo_meses: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateItemDto {
    plan_id: number;
    tarea: string;
    intervalo_km: number;
    intervalo_meses: number;
}