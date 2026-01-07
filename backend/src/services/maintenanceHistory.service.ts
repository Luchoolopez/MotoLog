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
            console.log("✅ Historial creado. ID:", newRecord.id);

            // 2. Procesar deducción de stock y consumos
            if (consumed_items && Array.isArray(consumed_items)) {
                console.log(`Procesando ${consumed_items.length} ítems consumidos.`);
                for (const consumed of consumed_items) {
                    const itemId = Number(consumed.warehouse_item_id);
                    const cantidad = Number(consumed.cantidad_usada) || 1;

                    console.log(`--- [ITEM ID: ${itemId}] ---`);
                    const warehouseItem = await WarehouseItem.findByPk(itemId, { transaction: t });

                    if (warehouseItem) {
                        const newStock = Math.max(0, warehouseItem.stock_actual - cantidad);
                        console.log(`Deduciendo stock: ${warehouseItem.nombre} (${warehouseItem.stock_actual} -> ${newStock})`);

                        await warehouseItem.update({ stock_actual: newStock }, { transaction: t });

                        await MaintenanceHistoryConsumption.create({
                            maintenance_history_id: newRecord.id,
                            warehouse_item_id: itemId,
                            cantidad_usada: cantidad
                        }, { transaction: t });

                        console.log(`✅ Consumo registrado para: ${warehouseItem.nombre}`);
                    } else {
                        console.error(`❌ ERROR: Ítem de almacén ID ${itemId} NO ENCONTRADO.`);
                        throw new Error(`El ítem de almacén con ID ${itemId} no fue encontrado. Es posible que haya sido eliminado.`);
                    }
                }
            }

            // 3. Actualizar odómetro de la moto si corresponde
            const moto = await Motorcycle.findByPk(data.moto_id, { transaction: t });
            if (moto && Number(data.km_realizado) > Number(moto.km_actual)) {
                console.log(`Actualizando KM moto: ${moto.id}: ${moto.km_actual} -> ${data.km_realizado}`);
                await moto.update({ km_actual: Number(data.km_realizado) }, { transaction: t });
            }

            await t.commit();
            console.log("--- FINALIZADO CON ÉXITO ---");
            return newRecord;

        } catch (error: any) {
            await t.rollback();
            console.error("--- ERROR EN REGISTRO DE MANTENIMIENTO ---");
            console.error("Detalle del error:", error);

            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new Error('Error de integridad: El ID de la moto o el ítem no son válidos.');
            }
            if (error.name === 'SequelizeValidationError') {
                throw new Error('Error de validación: ' + error.errors.map((e: any) => e.message).join(', '));
            }

            throw new Error('No se pudo registrar el mantenimiento: ' + (error.message || error));
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