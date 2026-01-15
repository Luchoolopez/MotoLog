"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceHistoryConsumption = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class MaintenanceHistoryConsumption extends sequelize_1.Model {
}
exports.MaintenanceHistoryConsumption = MaintenanceHistoryConsumption;
MaintenanceHistoryConsumption.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    maintenance_history_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'maintenance_history_id'
    },
    warehouse_item_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'warehouse_item_id'
    },
    cantidad_usada: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'cantidad_usada'
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'historial_mantenimiento_consumo',
    modelName: 'MaintenanceHistoryConsumption',
    timestamps: false,
    freezeTableName: true
});
