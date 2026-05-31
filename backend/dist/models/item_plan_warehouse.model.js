"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemPlanWarehouse = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ItemPlanWarehouse extends sequelize_1.Model {
}
exports.ItemPlanWarehouse = ItemPlanWarehouse;
ItemPlanWarehouse.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'item_plan_id'
    },
    warehouse_item_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'warehouse_item_id'
    },
    cantidad_sugerida: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'cantidad_sugerida'
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'item_plan_warehouse',
    modelName: 'ItemPlanWarehouse',
    timestamps: false,
    freezeTableName: true
});
