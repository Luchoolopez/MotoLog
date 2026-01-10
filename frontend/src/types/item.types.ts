export interface ItemPlan {
    id: number;
    plan_id: number;
    tarea: string;
    intervalo_km: number;
    intervalo_meses: number;
    tipo: string;
    consumo_sistematico: boolean;
    created_at?: string;
    updated_at?: string;
    items_almacen_asociados?: {
        id: number;
        nombre: string;
        nro_parte?: string | null;
        categoria?: string;
        stock_actual?: number;
        item_plan_warehouse: {
            cantidad_sugerida: number;
        }
    }[];
}

export interface CreateItemDto {
    plan_id: number;
    tarea: string;
    intervalo_km: number;
    intervalo_meses: number;
    tipo: string;
    consumo_sistematico: boolean;
    associated_items?: {
        warehouse_item_id: number;
        cantidad_sugerida: number;
    }[];
}