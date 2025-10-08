import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Maintenance } from './maintenance.model';

export interface MaintenanceIntervalAttributes {
    id: number;
    maintenance_id: number;
    model: string;
    action_set: string;
    interval_km?: number;
    interval_months?: number;
    first_due_km?: number;
    note?: string;
}

export type MaintenanceIntervalCreationAttributes = Optional<
    MaintenanceIntervalAttributes,
    'id' | 'interval_km' | 'interval_months' | 'first_due_km' | 'note'
>;

export class MaintenanceInterval
    extends Model<MaintenanceIntervalAttributes, MaintenanceIntervalCreationAttributes>
    implements MaintenanceIntervalAttributes {
    public id!: number;
    public maintenance_id!: number;
    public model!: string;
    public action_set!: string;
    public interval_km?: number;
    public interval_months?: number;
    public first_due_km?: number;
    public note?: string;
}

MaintenanceInterval.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        maintenance_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        action_set: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        interval_km: DataTypes.INTEGER,
        interval_months: DataTypes.INTEGER,
        first_due_km: DataTypes.INTEGER,
        note: DataTypes.STRING(255),
    },
    {
        sequelize,
        tableName: 'maintenance_intervals',
        timestamps: false,
    }
);

// relación
Maintenance.hasMany(MaintenanceInterval, { foreignKey: 'maintenance_id' });
MaintenanceInterval.belongsTo(Maintenance, { foreignKey: 'maintenance_id' });
