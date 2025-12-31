import { Motorcycle } from "../models/motorcycle.model";
import { MaintenancePlan } from "../models/maintenance_plan.model";
import { ItemsPlan } from "../models/items_plan.model";
import { MaintenanceHistory } from "../models/maintenance_history.model";

//interfaz para saber que devolverle al frontend
export interface MaintenanceStatus {
    item_id: number;
    tarea: string;
    estado: 'OK' | 'ALERTA' | 'VENCIDO';

    km_limite: number; //a q km debe hacerse 
    km_restantes: number; //cuantos km quedan

    fecha_limite: string;
    dias_restantes: number;
}

export class MaintenanceCalculatorService {
    async calculateStatus(motoId: number): Promise<MaintenanceStatus[]> {
        const motoRaw = await Motorcycle.findByPk(motoId, {
            include: [
                {
                    model: MaintenancePlan,
                    as: 'plan_mantenimiento',
                    include: [{ model: ItemsPlan, as: 'items' }]
                },
                {
                    model: MaintenanceHistory,
                    as: 'historial'
                }
            ]
        });
        if (!motoRaw) {
            throw new Error('Moto no encontrada')
        }

        const moto = motoRaw.toJSON() as any;

        if (!moto.plan_mantenimiento || !moto.plan_mantenimiento.items) {
            return [];
        }

        const historial = await MaintenanceHistory.findAll({
            where:{moto_id:motoId},
            attributes:['item_plan_id', 'fecha_realizado', 'km_realizado'],
            raw:true
        });

        const items = moto.plan_mantenimiento.items;
        const resultados: MaintenanceStatus[] = [];

        for (const item of items) {
            //filtra por id de item y ordena para obtener el mas reciente
            const mantenimientoItem = historial.filter((h: any) => h.item_plan_id === item.id);

            //ordena por fecha descendente
            mantenimientoItem.sort((a: any, b: any) => {
                return new Date(b.fecha_realizado).getTime() - new Date(a.fecha_realizado).getTime();
            });

            const ultimoService = mantenimientoItem[0];

            //definir un punto de partida, si nunca lo hizo, la base es la compra de la moto (0km y fecha compra)
            let baseKm:number;
            let baseFecha:Date;

            if (ultimoService) {
                baseKm = ultimoService.km_realizado;
                baseFecha = new Date(ultimoService.fecha_realizado);
            }else{
                baseKm = 0;
                baseFecha = new Date(moto.fecha_compra);
            }

            const targetKm = baseKm + item.intervalo_km;

            const targetFecha = new Date(baseFecha);
            targetFecha.setMonth(targetFecha.getMonth() + item.intervalo_meses);

            const kmRestantes = targetKm - moto.km_actual;

            const hoy = new Date();
            const diferenciaTiempo = targetFecha.getTime() - hoy.getTime();
            //convertir milisegundos a dias
            const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

            let estado: 'OK' | 'ALERTA' | 'VENCIDO' = 'OK';

            //vencido: si te pasaste de km o fecha
            //alerta: si te faltan menos de 500km o menos de 30 dias
            if (kmRestantes < 0 || diasRestantes < 0) {
                estado = 'VENCIDO';
            } else if (kmRestantes < 500 || diasRestantes < 30) {
                estado = 'ALERTA'
            }

            resultados.push({
                item_id: item.id,
                tarea: item.tarea || 'tarea sin nombre',
                estado: estado,
                km_limite: targetKm,
                km_restantes: kmRestantes,
                fecha_limite: targetFecha.toISOString().split('T')[0] || "", // Formato YYYY-MM-DD
                dias_restantes: diasRestantes
            });
        }
        return resultados;
    }
}