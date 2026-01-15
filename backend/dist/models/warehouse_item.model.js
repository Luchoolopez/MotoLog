"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseItem = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class WarehouseItem extends sequelize_1.Model {
}
exports.WarehouseItem = WarehouseItem;
WarehouseItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    nro_parte: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    fecha_compra: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    precio_compra: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    lugar_compra: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    stock_actual: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    modelo_moto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    observaciones: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'almacen_items',
    modelName: 'WarehouseItem',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
