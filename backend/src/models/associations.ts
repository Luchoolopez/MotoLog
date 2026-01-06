import { MaintenancePlan } from "./maintenance_plan.model";
import { MaintenanceHistory } from "./maintenance_history.model";
import { ItemsPlan } from "./items_plan.model";
import { Motorcycle } from "./motorcycle.model";
import { User } from "./user.model";


export const setupAssociations = () => {

    // --- 1. Plan <-> Items (Uno a Muchos) ---
    // Un Plan tiene muchos Items
    MaintenancePlan.hasMany(ItemsPlan, {
        foreignKey: 'plan_id',
        as: 'items'
    });
    // Un Item pertenece a un Plan
    ItemsPlan.belongsTo(MaintenancePlan, {
        foreignKey: 'plan_id',
        as: 'plan'
    });


    // --- 2. Plan <-> Motos (Uno a Muchos) ---
    // Un Plan se asigna a muchas Motos
    MaintenancePlan.hasMany(Motorcycle, {
        foreignKey: 'plan_id',
        as: 'motos_asignadas'
    });
    // Una Moto tiene un Plan
    Motorcycle.belongsTo(MaintenancePlan, {
        foreignKey: 'plan_id',
        as: 'plan_mantenimiento'
    });


    // --- 3. Moto <-> Historial (Uno a Muchos) ---
    // Una Moto tiene mucho historial
    Motorcycle.hasMany(MaintenanceHistory, {
        foreignKey: 'moto_id',
        as: 'historial'
    });
    // Un registro de historial pertenece a una Moto
    MaintenanceHistory.belongsTo(Motorcycle, {
        foreignKey: 'moto_id',
        as: 'moto'
    });


    // --- 4. ItemsPlan <-> Historial (Uno a Muchos) ---
    // Un Item (ej: "Cambio Aceite") aparece muchas veces en el historial (de distintas motos)
    ItemsPlan.hasMany(MaintenanceHistory, {
        foreignKey: 'item_plan_id',
        as: 'registros_historicos'
    });
    // Un registro de historial refiere a una tarea específica
    MaintenanceHistory.belongsTo(ItemsPlan, {
        foreignKey: 'item_plan_id',
        as: 'detalle_tarea'
    });


    // --- 5. User <-> Motos (Uno a Muchos) ---
    // Un User tiene muchas Motos
    User.hasMany(Motorcycle, {
        foreignKey: 'user_id',
        as: 'motos'
    });
    // Una Moto pertenece a un User
    Motorcycle.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'usuario'
    });

};