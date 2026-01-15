"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceCalculatorService = void 0;
const motorcycle_model_1 = require("../models/motorcycle.model");
const maintenance_plan_model_1 = require("../models/maintenance_plan.model");
const items_plan_model_1 = require("../models/items_plan.model");
const maintenance_history_model_1 = require("../models/maintenance_history.model");
class MaintenanceCalculatorService {
    async calculateStatus(motoId) {
        const motoRaw = await motorcycle_model_1.Motorcycle.findByPk(motoId, {
            include: [
                {
                    model: maintenance_plan_model_1.MaintenancePlan,
                    as: 'plan_mantenimiento',
                    include: [{ model: items_plan_model_1.ItemsPlan, as: 'items' }]
                },
                {
                    model: maintenance_history_model_1.MaintenanceHistory,
                    as: 'historial'
                }
            ]
        });
        if (!motoRaw) {
            throw new Error('Moto no encontrada');
        }
        const moto = motoRaw.toJSON();
        if (!moto.plan_mantenimiento || !moto.plan_mantenimiento.items) {
            return [];
        }
        const historial = await maintenance_history_model_1.MaintenanceHistory.findAll({
            where: { moto_id: motoId },
            attributes: ['item_plan_id', 'fecha_realizado', 'km_realizado'],
            raw: true
        });
        const items = moto.plan_mantenimiento.items;
        const resultados = [];
        for (const item of items) {
            //filtra por id de item y ordena para obtener el mas reciente
            const mantenimientoItem = historial.filter((h) => {
                // Debug log for filtering
                // console.log(`Checking Item ID ${item.id} vs History Item ID ${h.item_plan_id}`);
                return Number(h.item_plan_id) === Number(item.id);
            });
            //ordena por fecha descendente, luego por km descendente
            mantenimientoItem.sort((a, b) => {
                const fechaDiff = new Date(b.fecha_realizado).getTime() - new Date(a.fecha_realizado).getTime();
                if (fechaDiff !== 0)
                    return fechaDiff;
                return b.km_realizado - a.km_realizado;
            });
            const ultimoService = mantenimientoItem[0];
            console.log(`[Calculator] Task: ${item.tarea} (ID: ${item.id})`);
            console.log(`[Calculator] Last Service Found:`, ultimoService ? `KM: ${ultimoService.km_realizado} / Date: ${ultimoService.fecha_realizado}` : 'NONE');
            //definir un punto de partida, si nunca lo hizo, la base es la compra de la moto (0km y fecha compra)
            let baseKm;
            let baseFecha;
            if (ultimoService) {
                baseKm = ultimoService.km_realizado;
                baseFecha = new Date(ultimoService.fecha_realizado);
            }
            else {
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
            let estado = 'OK';
            //vencido: si te pasaste de km o fecha (si aplica)
            //alerta: si te faltan menos de 500km o menos de 30 dias (si aplica)
            const daysWarning = item.intervalo_meses > 0 ? diasRestantes < 30 : false;
            const daysExpired = item.intervalo_meses > 0 ? diasRestantes < 0 : false;
            const kmWarning = item.intervalo_km > 0 ? kmRestantes < 500 : false;
            const kmExpired = item.intervalo_km > 0 ? kmRestantes < 0 : false;
            if (kmExpired || daysExpired) {
                estado = 'VENCIDO';
            }
            else if (kmWarning || daysWarning) {
                estado = 'ALERTA';
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
        // Order: VENCIDO > ALERTA > OK
        // Inside group: "More overdue" (smaller km_restantes) first
        const statusPriority = { 'VENCIDO': 0, 'ALERTA': 1, 'OK': 2 };
        resultados.sort((a, b) => {
            // 1. Sort by Status Priority
            const priorityA = statusPriority[a.estado];
            const priorityB = statusPriority[b.estado];
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            // 2. Sort by Km Restantes (Ascending -> more negative first)
            // This works for "More Overdue" because -2000 < -100
            if (a.km_restantes !== b.km_restantes) {
                return a.km_restantes - b.km_restantes;
            }
            // 3. Fallback: Sort by Days Restantes (Ascending)
            return a.dias_restantes - b.dias_restantes;
        });
        return resultados;
    }
}
exports.MaintenanceCalculatorService = MaintenanceCalculatorService;
