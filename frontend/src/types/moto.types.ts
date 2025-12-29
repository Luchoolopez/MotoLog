export interface Motorcycle{
    id:number;
    marca:string;
    modelo:string;
    patente:string;
    km_actual:number;
    plan_id:number;
    plan_mantenimiento?:{
        nombre:string;
    }
}

//resultado del calculo
export interface MaintenanceStatus {
    item_id: number;
    tarea: string;
    estado: 'OK' | 'ALERTA' | 'VENCIDO';
    km_limite: number;
    km_restantes: number;
    fecha_limite: string;
    dias_restantes: number;
}

// Para crear una moto nueva
export interface CreateMotoDto {
    marca: string;
    modelo: string;
    patente: string;
    km_actual: number;
    fecha_compra: string | undefined;
    plan_id: number;
}