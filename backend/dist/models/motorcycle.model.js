"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motorcycle = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
;
class Motorcycle extends sequelize_1.Model {
}
exports.Motorcycle = Motorcycle;
;
Motorcycle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marca: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    anio: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    patente: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    km_actual: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fecha_compra: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'motos',
    modelName: 'motorcycle',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // soft delete
    deletedAt: 'deleted_at'
});
