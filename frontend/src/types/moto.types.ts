export interface Motorcycle {
    id: number;
    marca: string;
    modelo: string;
    anio: number;
    patente: string;
    km_actual: number;
    plan_id: number;
    plan_mantenimiento?: {
        nombre: string;
        items?: any[]; // We can be more specific if needed, but any[] or {length: number} is enough for now
    }
}

//resultado del calculo
export interface MaintenanceStatus {
    item_id: number;
    tarea: string;
    tipo: 'Inspección' | 'Cambio' | 'Limpieza' | 'Lubricación' | 'Ajuste';
    estado: 'OK' | 'ALERTA' | 'VENCIDO';
    km_limite: number;
    km_restantes: number;
    fecha_limite: string;
    dias_restantes: number;
    intervalo_km: number;
    intervalo_meses: number;
}

// Para crear una moto nueva
export interface CreateMotoDto {
    marca: string;
    modelo: string;
    anio: number;
    patente: string;
    km_actual: number;
    fecha_compra: string | undefined;
    plan_id: number;
}