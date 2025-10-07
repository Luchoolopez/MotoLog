import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface MaintenanceIntervalAttributes {
    id: number;
    maintenance_id: number;
    action: string;
    interval_km?: number | null;
    interval_months?: number | null;
    first_due_km?: number | null;
    note?: string | null;
}

export type MaintenanceIntervalCreationAttributes = Optional<MaintenanceIntervalAttributes, 'id'>;

export class MaintenanceInterval extends Model<MaintenanceIntervalAttributes, MaintenanceIntervalCreationAttributes>
    implements MaintenanceIntervalAttributes {
    public id!: number;
    public maintenance_id!: number;
    public action!: string;
    public interval_km!: number | null;
    public interval_months!: number | null;
    public first_due_km!: number | null;
    public note!: string | null;
}

MaintenanceInterval.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        maintenance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        interval_km: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        interval_months: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        first_due_km: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        note: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "maintenance_intervals",
        modelName: "MaintenanceInterval",
        timestamps: false,
    }
);
