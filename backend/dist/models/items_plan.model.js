"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsPlan = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ItemsPlan extends sequelize_1.Model {
}
exports.ItemsPlan = ItemsPlan;
ItemsPlan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    tarea: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING, // Changed from ENUM to STRING for multi-select
        allowNull: false,
        defaultValue: 'Inspección'
    },
    intervalo_km: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    intervalo_meses: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    consumo_sistematico: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'items_plan',
    modelName: 'ItemsPlan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
