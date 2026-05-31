"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelRecord = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class FuelRecord extends sequelize_1.Model {
}
exports.FuelRecord = FuelRecord;
FuelRecord.init({
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
    litros: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    precio_por_litro: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    empresa: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    km_momento: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'registros_combustible',
    modelName: 'registros_combustible',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
