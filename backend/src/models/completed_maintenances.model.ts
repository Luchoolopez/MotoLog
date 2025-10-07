import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface CompletedMaintenanceAttributes {
    id: number;
    motorcycle_id: number;
    maintenance_interval_id: number;
    km_performed: number;
    performed_at?: Date;
    notes?: string | null;
}

export type CompletedMaintenanceCreationAttributes = Optional<CompletedMaintenanceAttributes, 'id'>;

export class CompletedMaintenance extends Model<CompletedMaintenanceAttributes, CompletedMaintenanceCreationAttributes>
    implements CompletedMaintenanceAttributes {
    public id!: number;
    public motorcycle_id!: number;
    public maintenance_interval_id!: number;
    public km_performed!: number;
    public performed_at!: Date;
    public notes!: string | null;
}

CompletedMaintenance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        motorcycle_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maintenance_interval_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        km_performed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        performed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "completed_maintenances",
        modelName: "CompletedMaintenance",
        timestamps: false,
    }
);
