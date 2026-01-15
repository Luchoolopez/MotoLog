"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
const maintenance_plan_model_1 = require("./maintenance_plan.model");
const maintenance_history_model_1 = require("./maintenance_history.model");
const items_plan_model_1 = require("./items_plan.model");
const motorcycle_model_1 = require("./motorcycle.model");
const user_model_1 = require("./user.model");
const odometer_history_model_1 = require("./odometer_history.model");
const fuel_record_model_1 = require("./fuel_record.model");
const warehouse_item_model_1 = require("./warehouse_item.model");
const item_plan_warehouse_model_1 = require("./item_plan_warehouse.model");
const maintenance_history_consumption_model_1 = require("./maintenance_history_consumption.model");
const license_insurance_model_1 = require("./license_insurance.model");
const fine_model_1 = require("./fine.model");
const setupAssociations = () => {
    // --- 1. Plan <-> Items (Uno a Muchos) ---
    // Un Plan tiene muchos Items
    maintenance_plan_model_1.MaintenancePlan.hasMany(items_plan_model_1.ItemsPlan, {
        foreignKey: 'plan_id',
        as: 'items'
    });
    // Un Item pertenece a un Plan
    items_plan_model_1.ItemsPlan.belongsTo(maintenance_plan_model_1.MaintenancePlan, {
        foreignKey: 'plan_id',
        as: 'plan'
    });
    // --- 2. Plan <-> Motos (Uno a Muchos) ---
    // Un Plan se asigna a muchas Motos
    maintenance_plan_model_1.MaintenancePlan.hasMany(motorcycle_model_1.Motorcycle, {
        foreignKey: 'plan_id',
        as: 'motos_asignadas'
    });
    // Una Moto tiene un Plan
    motorcycle_model_1.Motorcycle.belongsTo(maintenance_plan_model_1.MaintenancePlan, {
        foreignKey: 'plan_id',
        as: 'plan_mantenimiento'
    });
    // --- 3. Moto <-> Historial (Uno a Muchos) ---
    // Una Moto tiene mucho historial
    motorcycle_model_1.Motorcycle.hasMany(maintenance_history_model_1.MaintenanceHistory, {
        foreignKey: 'moto_id',
        as: 'historial'
    });
    // Un registro de historial pertenece a una Moto
    maintenance_history_model_1.MaintenanceHistory.belongsTo(motorcycle_model_1.Motorcycle, {
        foreignKey: 'moto_id',
        as: 'moto'
    });
    // --- 4. ItemsPlan <-> Historial (Uno a Muchos) ---
    // Un Item (ej: "Cambio Aceite") aparece muchas veces en el historial (de distintas motos)
    items_plan_model_1.ItemsPlan.hasMany(maintenance_history_model_1.MaintenanceHistory, {
        foreignKey: 'item_plan_id',
        as: 'registros_historicos'
    });
    // Un registro de historial refiere a una tarea específica
    maintenance_history_model_1.MaintenanceHistory.belongsTo(items_plan_model_1.ItemsPlan, {
        foreignKey: 'item_plan_id',
        as: 'detalle_tarea'
    });
    // --- 5. User <-> Motos (Uno a Muchos) ---
    // Un User tiene muchas Motos
    user_model_1.User.hasMany(motorcycle_model_1.Motorcycle, {
        foreignKey: 'user_id',
        as: 'motos'
    });
    // Una Moto pertenece a un User
    motorcycle_model_1.Motorcycle.belongsTo(user_model_1.User, {
        foreignKey: 'user_id',
        as: 'usuario'
    });
    // --- 6. Moto <-> Historial Odometro (Uno a Muchos) ---
    motorcycle_model_1.Motorcycle.hasMany(odometer_history_model_1.OdometerHistory, {
        foreignKey: 'moto_id',
        as: 'historial_odometro'
    });
    odometer_history_model_1.OdometerHistory.belongsTo(motorcycle_model_1.Motorcycle, {
        foreignKey: 'moto_id',
        as: 'moto'
    });
    // --- 7. Moto <-> Registro Combustible (Uno a Muchos) ---
    motorcycle_model_1.Motorcycle.hasMany(fuel_record_model_1.FuelRecord, {
        foreignKey: 'moto_id',
        as: 'registros_combustible'
    });
    fuel_record_model_1.FuelRecord.belongsTo(motorcycle_model_1.Motorcycle, {
        foreignKey: 'moto_id',
        as: 'moto'
    });
    // --- 8. User <-> Almacen (Uno a Muchos) ---
    user_model_1.User.hasMany(warehouse_item_model_1.WarehouseItem, {
        foreignKey: 'user_id',
        as: 'items_almacen'
    });
    warehouse_item_model_1.WarehouseItem.belongsTo(user_model_1.User, {
        foreignKey: 'user_id',
        as: 'usuario'
    });
    // --- 9. ItemsPlan <-> WarehouseItem (Muchos a Muchos) ---
    items_plan_model_1.ItemsPlan.belongsToMany(warehouse_item_model_1.WarehouseItem, {
        through: item_plan_warehouse_model_1.ItemPlanWarehouse,
        foreignKey: 'item_plan_id',
        otherKey: 'warehouse_item_id',
        as: 'items_almacen_asociados'
    });
    warehouse_item_model_1.WarehouseItem.belongsToMany(items_plan_model_1.ItemsPlan, {
        through: item_plan_warehouse_model_1.ItemPlanWarehouse,
        foreignKey: 'warehouse_item_id',
        otherKey: 'item_plan_id',
        as: 'reglas_asociadas'
    });
    // --- 10. MaintenanceHistory <-> WarehouseItem (Muchos a Muchos vía Consumo) ---
    maintenance_history_model_1.MaintenanceHistory.belongsToMany(warehouse_item_model_1.WarehouseItem, {
        through: maintenance_history_consumption_model_1.MaintenanceHistoryConsumption,
        foreignKey: 'maintenance_history_id',
        otherKey: 'warehouse_item_id',
        as: 'consumos'
    });
    warehouse_item_model_1.WarehouseItem.belongsToMany(maintenance_history_model_1.MaintenanceHistory, {
        through: maintenance_history_consumption_model_1.MaintenanceHistoryConsumption,
        foreignKey: 'warehouse_item_id',
        otherKey: 'maintenance_history_id',
        as: 'usado_en_servicios'
    });
    // --- 11. MaintenanceHistoryConsumption (Join Table) BelongsTo associations ---
    maintenance_history_consumption_model_1.MaintenanceHistoryConsumption.belongsTo(maintenance_history_model_1.MaintenanceHistory, {
        foreignKey: 'maintenance_history_id',
        as: 'mantenimiento'
    });
    maintenance_history_consumption_model_1.MaintenanceHistoryConsumption.belongsTo(warehouse_item_model_1.WarehouseItem, {
        foreignKey: 'warehouse_item_id',
        as: 'item'
    });
    // --- 12. User/Moto <-> LicenseInsurance ---
    user_model_1.User.hasMany(license_insurance_model_1.LicenseInsurance, {
        foreignKey: 'user_id',
        as: 'documentacion'
    });
    license_insurance_model_1.LicenseInsurance.belongsTo(user_model_1.User, {
        foreignKey: 'user_id',
        as: 'usuario'
    });
    motorcycle_model_1.Motorcycle.hasMany(license_insurance_model_1.LicenseInsurance, {
        foreignKey: 'moto_id',
        as: 'documentos'
    });
    license_insurance_model_1.LicenseInsurance.belongsTo(motorcycle_model_1.Motorcycle, {
        foreignKey: 'moto_id',
        as: 'moto'
    });
    // --- 13. Moto <-> Fine (Uno a Muchos) ---
    motorcycle_model_1.Motorcycle.hasMany(fine_model_1.Fine, {
        foreignKey: 'moto_id',
        as: 'multas'
    });
    fine_model_1.Fine.belongsTo(motorcycle_model_1.Motorcycle, {
        foreignKey: 'moto_id',
        as: 'moto'
    });
};
exports.setupAssociations = setupAssociations;
