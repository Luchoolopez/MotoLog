import { WarehouseItem, WarehouseItemCreationAttributes } from "../models/warehouse_item.model";

export class WarehouseService {
    async create(data: WarehouseItemCreationAttributes) {
        try {
            // Set stock_actual equal to cantidad if not provided
            if (data.stock_actual === undefined) {
                data.stock_actual = data.cantidad;
            }
            return await WarehouseItem.create(data);
        } catch (error) {
            throw new Error('Error al crear item en almacén: ' + error);
        }
    }

    async getAllByUser(userId: number) {
        try {
            return await WarehouseItem.findAll({
                where: { user_id: userId },
                order: [['fecha_compra', 'DESC']]
            });
        } catch (error) {
            throw new Error('Error al obtener items del almacén: ' + error);
        }
    }

    async getById(id: number, userId: number) {
        try {
            const item = await WarehouseItem.findOne({
                where: { id, user_id: userId }
            });
            if (!item) throw new Error('Item no encontrado');
            return item;
        } catch (error) {
            throw new Error('Error al obtener item del almacén: ' + error);
        }
    }

    async update(id: number, userId: number, data: any) {
        try {
            const item = await this.getById(id, userId);
            return await item.update(data);
        } catch (error) {
            throw new Error('Error al actualizar item del almacén: ' + error);
        }
    }

    async delete(id: number, userId: number) {
        try {
            const item = await this.getById(id, userId);
            return await item.destroy();
        } catch (error) {
            throw new Error('Error al eliminar item del almacén: ' + error);
        }
    }
}
