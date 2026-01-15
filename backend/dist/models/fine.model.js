"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fine = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Fine extends sequelize_1.Model {
}
exports.Fine = Fine;
Fine.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    moto_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('Multa', 'Service', 'Otro'),
        allowNull: false,
        defaultValue: 'Multa'
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false, // Ej: "Exceso de velocidad", "Renovación Licencia"
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('Pendiente', 'Pagado', 'Apelado', 'Anulado'),
        allowNull: false,
        defaultValue: 'Pendiente',
    },
    comments: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Fine',
    tableName: 'fines',
});
