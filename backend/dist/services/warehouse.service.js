"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const warehouse_item_model_1 = require("../models/warehouse_item.model");
const maintenance_history_consumption_model_1 = require("../models/maintenance_history_consumption.model");
const maintenance_history_model_1 = require("../models/maintenance_history.model");
const motorcycle_model_1 = require("../models/motorcycle.model");
const items_plan_model_1 = require("../models/items_plan.model");
const item_plan_warehouse_model_1 = require("../models/item_plan_warehouse.model");
class WarehouseService {
    async create(data) {
        try {
            // Set stock_actual equal to cantidad if not provided
            if (data.stock_actual === undefined) {
                data.stock_actual = data.cantidad;
            }
            return await warehouse_item_model_1.WarehouseItem.create(data);
        }
        catch (error) {
            throw new Error('Error al crear item en almacén: ' + error);
        }
    }
    async getAllByUser(userId) {
        try {
            return await warehouse_item_model_1.WarehouseItem.findAll({
                where: { user_id: userId },
                order: [['fecha_compra', 'DESC']]
            });
        }
        catch (error) {
            throw new Error('Error al obtener items del almacén: ' + error);
        }
    }
    async getById(id, userId) {
        try {
            const item = await warehouse_item_model_1.WarehouseItem.findOne({
                where: { id, user_id: userId }
            });
            if (!item)
                throw new Error('Item no encontrado');
            return item;
        }
        catch (error) {
            throw new Error('Error al obtener item del almacén: ' + error);
        }
    }
    async update(id, userId, data) {
        try {
            const item = await this.getById(id, userId);
            return await item.update(data);
        }
        catch (error) {
            throw new Error('Error al actualizar item del almacén: ' + error);
        }
    }
    async delete(id, userId) {
        try {
            const item = await this.getById(id, userId);
            // Cleanup: Remove associations with maintenance rules before deleting the item
            await item_plan_warehouse_model_1.ItemPlanWarehouse.destroy({ where: { warehouse_item_id: id } });
            console.log(`Limpiadas asociaciones del item ${id} en item_plan_warehouse`);
            return await item.destroy();
        }
        catch (error) {
            throw new Error('Error al eliminar item del almacén: ' + error);
        }
    }
    async getItemUsageHistory(itemId, userId, isGlobal = false) {
        try {
            const item = await this.getById(itemId, userId);
            let itemIds = [itemId];
            if (isGlobal) {
                const similarItems = await warehouse_item_model_1.WarehouseItem.findAll({
                    where: {
                        user_id: userId,
                        nombre: item.nombre,
                        nro_parte: item.nro_parte
                    },
                    attributes: ['id']
                });
                itemIds = similarItems.map(i => i.id);
            }
            // 1. Get consumption (Stock Out)
            const consumptions = await maintenance_history_consumption_model_1.MaintenanceHistoryConsumption.findAll({
                where: { warehouse_item_id: itemIds },
                include: [
                    {
                        model: maintenance_history_model_1.MaintenanceHistory,
                        as: 'mantenimiento',
                        attributes: ['id', 'fecha_realizado', 'km_realizado', 'observaciones'],
                        include: [
                            {
                                model: motorcycle_model_1.Motorcycle,
                                as: 'moto',
                                attributes: ['id', 'marca', 'modelo', 'patente']
                            },
                            {
                                model: items_plan_model_1.ItemsPlan,
                                as: 'detalle_tarea',
                                attributes: ['tarea']
                            }
                        ]
                    }
                ]
            });
            // 2. Get purchases (Stock In)
            const purchases = await warehouse_item_model_1.WarehouseItem.findAll({
                where: { id: itemIds },
                attributes: ['id', 'nombre', 'cantidad', 'fecha_compra', 'precio_compra', 'lugar_compra']
            });
            // 3. Format and Merge
            const formattedHistory = [
                ...consumptions.map((c) => ({
                    type: 'CONSUMPTION',
                    id: c.id,
                    date: c.mantenimiento.fecha_realizado,
                    quantity: -c.cantidad_usada,
                    detail: c.mantenimiento.detalle_tarea?.tarea || 'Tarea personalizada',
                    moto: `${c.mantenimiento.moto.marca} ${c.mantenimiento.moto.modelo} (${c.mantenimiento.moto.patente})`,
                    km: c.mantenimiento.km_realizado
                })),
                ...purchases.map((p) => ({
                    type: 'PURCHASE',
                    id: p.id,
                    date: p.fecha_compra,
                    quantity: p.cantidad,
                    detail: `Compra: ${p.lugar_compra || 'N/A'}`,
                    price: p.precio_compra
                }))
            ];
            // Sort by date descending
            return formattedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        catch (error) {
            throw new Error('Error al obtener historial de uso del item: ' + error);
        }
    }
}
exports.WarehouseService = WarehouseService;
