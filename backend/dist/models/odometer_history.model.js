"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdometerHistory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class OdometerHistory extends sequelize_1.Model {
}
exports.OdometerHistory = OdometerHistory;
OdometerHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    moto_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    km: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'historial_odometro',
    modelName: 'historial_odometro',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
