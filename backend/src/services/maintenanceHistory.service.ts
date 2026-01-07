import { MaintenanceHistory } from "../models/maintenance_history.model";
import { Motorcycle } from "../models/motorcycle.model";
import { ItemsPlan } from "../models/items_plan.model";
import { WarehouseItem } from "../models/warehouse_item.model";
import { MaintenanceHistoryConsumption } from "../models/maintenance_history_consumption.model";
import { sequelize } from "../config/database";
import { createMaintenanceHistoryType, updateMaintenanceHistoryType } from "../validations/maintenance_history.schema";

export class MaintenanceHistoryService {

    async create(data: any) {
        const t = await sequelize.transaction();
        try {
            console.log("--- INICIANDO REGISTRO DE MANTENIMIENTO ---");
            console.log("Datos recibidos:", JSON.stringify(data));

            const { consumed_items, ...historyData } = data;

            if (!historyData.moto_id || !historyData.item_plan_id) {
                throw new Error('Faltan campos obligatorios: moto_id o item_plan_id');
            }

            // 1. Crear el registro de historial
            const newRecord = await MaintenanceHistory.create(historyData as any, { transaction: t });
            const historyId = newRecord.id;
            console.log("✅ Historial creado. ID:", historyId);

            // 2. Procesar deducción de stock y consumos
            if (consumed_items && Array.isArray(consumed_items) && consumed_items.length > 0) {
                console.log(`Procesando ${consumed_items.length} ítems consumidos.`);

                // Agrupar por ID para evitar múltiples updates al mismo registro en la misma transacción
                const grouped = consumed_items.reduce((acc: any, item: any) => {
                    const id = Number(item.warehouse_item_id);
                    if (!id) return acc;
                    acc[id] = (acc[id] || 0) + Math.max(1, Number(item.cantidad_usada) || 1);
                    return acc;
                }, {});

                for (const [itemIdStr, cantidadUsada] of Object.entries(grouped)) {
                    const warehouseItemId = Number(itemIdStr);
                    const cantidad = Number(cantidadUsada);

                    console.log(`--- [ITEM ID: ${warehouseItemId}] ---`);
                    const warehouseItem = await WarehouseItem.findByPk(warehouseItemId, { transaction: t });

                    if (!warehouseItem) {
                        console.error(`❌ ERROR: Ítem de almacén ID ${warehouseItemId} NO ENCONTRADO.`);
                        throw new Error(`El ítem de almacén con ID ${warehouseItemId} no fue encontrado.`);
                    }

                    const stockAnterior = warehouseItem.stock_actual;
                    const stockNuevo = stockAnterior - cantidad;

                    console.log(`Deduciendo stock para ${warehouseItem.nombre}: ${stockAnterior} -> ${stockNuevo}`);

                    // Actualización directa
                    await warehouseItem.update({ stock_actual: Math.max(0, stockNuevo) }, { transaction: t });

                    // Registrar el consumo en la tabla intermedia
                    await MaintenanceHistoryConsumption.create({
                        maintenance_history_id: historyId,
                        warehouse_item_id: warehouseItemId,
                        cantidad_usada: cantidad
                    }, { transaction: t });

                    console.log(`✅ Consumo registrado para: ${warehouseItem.nombre}`);
                }
            }

            // 3. Actualizar odómetro de la moto si corresponde
            const motoId = Number(data.moto_id);
            const kmRealizado = Number(data.km_realizado);

            const moto = await Motorcycle.findByPk(motoId, { transaction: t });
            if (moto && kmRealizado > Number(moto.km_actual)) {
                console.log(`Actualizando KM moto ${moto.id}: ${moto.km_actual} -> ${kmRealizado}`);
                await moto.update({ km_actual: kmRealizado }, { transaction: t });
            }

            await t.commit();
            console.log("--- FINALIZADO CON ÉXITO ---");
            return newRecord;

        } catch (error: any) {
            if (t) await t.rollback();
            console.error("--- ERROR EN REGISTRO DE MANTENIMIENTO ---");
            console.error("Mensaje:", error.message);
            console.error("Stack:", error.stack);

            // Re-lanzamos un error con más contexto si es posible
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new Error(`Error de integridad (FK): Verifique que el ID de la moto (${data.moto_id}) y los IDs de los ítems del almacén sean correctos.`);
            }
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map((e: any) => e.message).join(', ');
                throw new Error(`Error de validación: ${details}`);
            }

            throw error; // Lanzar el error original para capturar el mensaje exacto
        }
    }

    async getHistoryByMotoId(motoId: number) {
        return await MaintenanceHistory.findAll({
            where: { moto_id: motoId },
            include: [
                {
                    model: ItemsPlan,
                    as: 'detalle_tarea',
                    attributes: ['tarea', 'intervalo_km']
                }
            ],
            order: [['fecha_realizado', 'DESC']]
        });
    }

    async getById(id: number) {
        const record = await MaintenanceHistory.findByPk(id);
        if (!record) {
            throw new Error('Registro de historial no encontrado');
        }
        return record;
    }

    async update(id: number, data: updateMaintenanceHistoryType) {
        const record = await this.getById(id);
        await record.update(data as any);
        return record;
    }

    async delete(id: number) {
        const record = await this.getById(id);
        await record.destroy();
        return { message: 'Registro eliminado correctamente' };
    }
}