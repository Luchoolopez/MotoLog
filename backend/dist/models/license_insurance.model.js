"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseInsurance = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class LicenseInsurance extends sequelize_1.Model {
}
exports.LicenseInsurance = LicenseInsurance;
LicenseInsurance.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    moto_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM('Patente', 'Seguro', 'VTV'),
        allowNull: false,
    },
    entidad: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nro_documento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fecha_vencimiento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    monto: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    cobertura: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    cuota: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pagado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    fecha_pago: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    observaciones: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'LicenseInsurance',
    tableName: 'license_insurance',
});
