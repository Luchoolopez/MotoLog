import { Motorcycle } from './motorcycles.model';
import { Maintenance } from './maintenances.model';
import { MaintenanceInterval } from './maintenance.intervals.model';
import { CompletedMaintenance } from './completed_maintenances.model';

Maintenance.hasMany(MaintenanceInterval, {
    foreignKey: 'maintenance_id',
    as: 'intervals',
});
MaintenanceInterval.belongsTo(Maintenance, {
    foreignKey: 'maintenance_id',
    as: 'maintenance',
});
Motorcycle.hasMany(CompletedMaintenance, {
    foreignKey: 'motorcycle_id',
    as: 'completedMaintenances',
});
CompletedMaintenance.belongsTo(Motorcycle, {
    foreignKey: "motorcycle_id",
    as: "motorcycle",
});

MaintenanceInterval.hasMany(CompletedMaintenance, {
    foreignKey: "maintenance_interval_id",
    as: "completedMaintenances",
});
CompletedMaintenance.belongsTo(MaintenanceInterval, {
    foreignKey: "maintenance_interval_id",
    as: "maintenanceInterval",
});

export {
    Motorcycle,
    Maintenance,
    MaintenanceInterval,
    CompletedMaintenance,
};

