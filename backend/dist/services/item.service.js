"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const items_plan_model_1 = require("../models/items_plan.model");
const maintenance_history_model_1 = require("../models/maintenance_history.model");
const warehouse_item_model_1 = require("../models/warehouse_item.model");
const item_plan_warehouse_model_1 = require("../models/item_plan_warehouse.model");
class ItemsService {
    async createItem(data) {
        try {
            const { associated_items, ...itemData } = data;
            const newItem = await items_plan_model_1.ItemsPlan.create(itemData);
            if (associated_items && Array.isArray(associated_items)) {
                for (const assoc of associated_items) {
                    await item_plan_warehouse_model_1.ItemPlanWarehouse.create({
                        item_plan_id: newItem.id,
                        warehouse_item_id: assoc.warehouse_item_id,
                        cantidad_sugerida: assoc.cantidad_sugerida || 1
                    });
                }
            }
            return newItem;
        }
        catch (error) {
            throw new Error('Error al crear el item: ' + error);
        }
    }
    async getAll() {
        return await items_plan_model_1.ItemsPlan.findAll();
    }
    async getItemById(id) {
        const item = await items_plan_model_1.ItemsPlan.findByPk(id, {
            include: [
                {
                    model: warehouse_item_model_1.WarehouseItem,
                    as: 'items_almacen_asociados',
                    through: { attributes: ['cantidad_sugerida'] }
                }
            ]
        });
        if (!item) {
            throw new Error('Item no encontrado');
        }
        return item;
    }
    async updateItem(id, data) {
        const { associated_items, ...itemData } = data;
        const item = await this.getItemById(id);
        await item.update(itemData);
        if (associated_items && Array.isArray(associated_items)) {
            // Delete existing associations and recreate
            await item_plan_warehouse_model_1.ItemPlanWarehouse.destroy({ where: { item_plan_id: id } });
            for (const assoc of associated_items) {
                await item_plan_warehouse_model_1.ItemPlanWarehouse.create({
                    item_plan_id: id,
                    warehouse_item_id: assoc.warehouse_item_id,
                    cantidad_sugerida: assoc.cantidad_sugerida || 1
                });
            }
        }
        return await this.getItemById(id);
    }
    async deleteItem(id) {
        // Cascade Delete: First remove all history records associated with this item
        await maintenance_history_model_1.MaintenanceHistory.destroy({ where: { item_plan_id: id } });
        const item = await this.getItemById(id);
        await item.destroy();
        return { message: 'Item eliminado correctamente' };
    }
    async getItemsByPlanId(planId) {
        return await items_plan_model_1.ItemsPlan.findAll({ where: { plan_id: planId } });
    }
}
exports.ItemsService = ItemsService;
