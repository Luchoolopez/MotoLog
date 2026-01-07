import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ItemPlanWarehouseAttributes {
    id: number;
    item_plan_id: number;
    warehouse_item_id: number;
    cantidad_sugerida: number;
}

type ItemPlanWarehouseCreationAttributes = Optional<ItemPlanWarehouseAttributes, 'id'>;

export class ItemPlanWarehouse extends Model<ItemPlanWarehouseAttributes, ItemPlanWarehouseCreationAttributes> implements ItemPlanWarehouseAttributes {
    public id!: number;
    public item_plan_id!: number;
    public warehouse_item_id!: number;
    public cantidad_sugerida!: number;
}

ItemPlanWarehouse.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        item_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'item_plan_id'
        },
        warehouse_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'warehouse_item_id'
        },
        cantidad_sugerida: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'cantidad_sugerida'
        }
    },
    {
        sequelize,
        tableName: 'item_plan_warehouse',
        modelName: 'item_plan_warehouse',
        timestamps: false,
        freezeTableName: true
    }
);
