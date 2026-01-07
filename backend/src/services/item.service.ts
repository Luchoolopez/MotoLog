import { ItemsPlan } from "../models/items_plan.model";
import { MaintenanceHistory } from "../models/maintenance_history.model";
import { WarehouseItem } from "../models/warehouse_item.model";
import { ItemPlanWarehouse } from "../models/item_plan_warehouse.model";
import { createItemsPlanType, updateItemsPlanType } from "../validations/items_plan.schema";

export class ItemsService {

    async createItem(data: any) {
        try {
            const { associated_items, ...itemData } = data;
            const newItem = await ItemsPlan.create(itemData);

            if (associated_items && Array.isArray(associated_items)) {
                for (const assoc of associated_items) {
                    await ItemPlanWarehouse.create({
                        item_plan_id: newItem.id,
                        warehouse_item_id: assoc.warehouse_item_id,
                        cantidad_sugerida: assoc.cantidad_sugerida || 1
                    });
                }
            }

            return newItem;
        } catch (error) {
            throw new Error('Error al crear el item: ' + error);
        }
    }

    async getAll() {
        return await ItemsPlan.findAll();
    }

    async getItemById(id: number) {
        const item = await ItemsPlan.findByPk(id, {
            include: [
                {
                    model: WarehouseItem,
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

    async updateItem(id: number, data: any) {
        const { associated_items, ...itemData } = data;
        const item = await this.getItemById(id);
        await item.update(itemData);

        if (associated_items && Array.isArray(associated_items)) {
            // Delete existing associations and recreate
            await ItemPlanWarehouse.destroy({ where: { item_plan_id: id } });
            for (const assoc of associated_items) {
                await ItemPlanWarehouse.create({
                    item_plan_id: id,
                    warehouse_item_id: assoc.warehouse_item_id,
                    cantidad_sugerida: assoc.cantidad_sugerida || 1
                });
            }
        }
        return await this.getItemById(id);
    }

    async deleteItem(id: number) {
        // Cascade Delete: First remove all history records associated with this item
        await MaintenanceHistory.destroy({ where: { item_plan_id: id } });
        const item = await this.getItemById(id);
        await item.destroy();
        return { message: 'Item eliminado correctamente' }
    }

    async getItemsByPlanId(planId: number) {
        return await ItemsPlan.findAll({ where: { plan_id: planId } });
    }
}