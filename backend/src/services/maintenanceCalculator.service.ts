import { Motorcycle } from "../models/motorcycle.model";
import { MaintenancePlan } from "../models/maintenance_plan.model";
import { ItemsPlan } from "../models/items_plan.model";
import { MaintenanceHistory } from "../models/maintenance_history.model";

//interfaz para saber que devolverle al frontend
export interface MaintenanceStatus {
    item_id: number;
    tarea: string;
    tipo: 'Inspección' | 'Cambio' | 'Limpieza' | 'Lubricación' | 'Ajuste';
    estado: 'OK' | 'ALERTA' | 'VENCIDO';

    km_limite: number; //a q km debe hacerse 
    km_restantes: number; //cuantos km quedan

    fecha_limite: string;
    dias_restantes: number;
    intervalo_km: number;
    intervalo_meses: number;
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
            where: { moto_id: motoId },
            attributes: ['item_plan_id', 'fecha_realizado', 'km_realizado'],
            raw: true
        });

        const items = moto.plan_mantenimiento.items;
        const resultados: MaintenanceStatus[] = [];

        for (const item of items) {
            //filtra por id de item y ordena para obtener el mas reciente
            const mantenimientoItem = historial.filter((h: any) => {
                // Debug log for filtering
                // console.log(`Checking Item ID ${item.id} vs History Item ID ${h.item_plan_id}`);
                return Number(h.item_plan_id) === Number(item.id);
            });

            //ordena por fecha descendente, luego por km descendente
            mantenimientoItem.sort((a: any, b: any) => {
                const fechaDiff = new Date(b.fecha_realizado).getTime() - new Date(a.fecha_realizado).getTime();
                if (fechaDiff !== 0) return fechaDiff;
                return b.km_realizado - a.km_realizado;
            });

            const ultimoService = mantenimientoItem[0];

            console.log(`[Calculator] Task: ${item.tarea} (ID: ${item.id})`);
            console.log(`[Calculator] Last Service Found:`, ultimoService ? `KM: ${ultimoService.km_realizado} / Date: ${ultimoService.fecha_realizado}` : 'NONE');

            //definir un punto de partida, si nunca lo hizo, la base es la compra de la moto (0km y fecha compra)
            let baseKm: number;
            let baseFecha: Date;

            if (ultimoService) {
                baseKm = ultimoService.km_realizado;
                baseFecha = new Date(ultimoService.fecha_realizado);
            } else {
                baseKm = 0;
                baseFecha = new Date(moto.fecha_compra);
            }

            const targetKm = baseKm + item.intervalo_km;

            const kmRestantes = targetKm - moto.km_actual;

            let diasRestantes = 9999; // Default huge number if no date limit
            let targetFecha = new Date(baseFecha); // Init with base

            // Calculate Date limit only if interval > 0
            if (item.intervalo_meses > 0) {
                targetFecha.setMonth(targetFecha.getMonth() + item.intervalo_meses);
                const hoy = new Date();
                const diferenciaTiempo = targetFecha.getTime() - hoy.getTime();
                diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
            }

            let estado: 'OK' | 'ALERTA' | 'VENCIDO' = 'OK';

            //vencido: si te pasaste de km o fecha (si aplica)
            //alerta: si te faltan menos de 500km o menos de 30 dias (si aplica)

            const daysWarning = item.intervalo_meses > 0 ? diasRestantes < 30 : false;
            const daysExpired = item.intervalo_meses > 0 ? diasRestantes < 0 : false;

            const kmWarning = item.intervalo_km > 0 ? kmRestantes < 500 : false;
            const kmExpired = item.intervalo_km > 0 ? kmRestantes < 0 : false;

            if (kmExpired || daysExpired) {
                estado = 'VENCIDO';
            } else if (kmWarning || daysWarning) {
                estado = 'ALERTA'
            }

            resultados.push({
                item_id: item.id,
                tarea: item.tarea || 'tarea sin nombre',
                tipo: item.tipo || 'Inspección',
                estado: estado,
                km_limite: targetKm,
                km_restantes: kmRestantes,
                fecha_limite: targetFecha.toISOString().split('T')[0] || "", // Formato YYYY-MM-DD
                dias_restantes: diasRestantes,
                intervalo_km: item.intervalo_km,
                intervalo_meses: item.intervalo_meses
            });
        }
        return resultados;
    }
}