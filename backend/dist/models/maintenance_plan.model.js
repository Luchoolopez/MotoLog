"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenancePlan = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
;
class MaintenancePlan extends sequelize_1.Model {
}
exports.MaintenancePlan = MaintenancePlan;
MaintenancePlan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'planes_mantenimiento',
    modelName: 'plan_mantenimiento',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
