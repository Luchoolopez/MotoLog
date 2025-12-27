import { ItemsPlan } from "../models/items_plan.model";
import { MaintenanceHistory } from "../models/maintenance_history.model";
import { createItemsPlanType, updateItemsPlanType } from "../validations/items_plan.schema";

export class ItemsService {
    
    async createItem(data: createItemsPlanType) {
        try {
            const newItem = await ItemsPlan.create(data);
            return newItem;
        } catch (error) {
            throw new Error('Error al crear el item: ' + error);
        }
    }

    async getAll() {
        return await ItemsPlan.findAll();
    }

    async getItemById(id: number) {
        const item = await ItemsPlan.findByPk(id);
        if (!item) {
            throw new Error('Item no encontrado');
        }
        return item;
    }

    async updateItem(id: number, data: updateItemsPlanType) {
        const item = await this.getItemById(id);
        await item.update(data as any);
        return item;
    }

    async deleteItem(id: number) {
        const historialCount = await MaintenanceHistory.count({where:{item_plan_id:id}});
        if(historialCount > 0){
            throw new Error('No se puede eliminar este item porque hay historiales que depende el. Editalo en su lugar');
        }
        const item = await this.getItemById(id);
        await item.destroy();
        return {message:'Item eliminado correctamente'}
    }
    
    async getItemsByPlanId(planId: number) {
        return await ItemsPlan.findAll({ where: { plan_id: planId } });
    }
}