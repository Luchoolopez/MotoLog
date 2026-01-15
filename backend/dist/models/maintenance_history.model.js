"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceHistory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
;
class MaintenanceHistory extends sequelize_1.Model {
}
exports.MaintenanceHistory = MaintenanceHistory;
MaintenanceHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    moto_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    item_plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    tarea_ad_hoc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fecha_realizado: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false
    },
    km_realizado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    observaciones: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'historial_mantenimiento',
    modelName: 'MaintenanceHistory',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
