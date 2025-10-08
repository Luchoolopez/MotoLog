import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MaintenanceAttributes {
    id: number;
    item: string;
    description?: string;
    category?: 'EMISSION' | 'NON-EMISSION';
    default_notes?: string;
    created_at?: Date;
}

export type MaintenanceCreationAttributes = Optional<MaintenanceAttributes, 'id' | 'description' | 'category' | 'default_notes' | 'created_at'>;

export class Maintenance extends Model<MaintenanceAttributes, MaintenanceCreationAttributes> implements MaintenanceAttributes {
    public id!: number;
    public item!: string;
    public description?: string;
    public category?: 'EMISSION' | 'NON-EMISSION';
    public default_notes?: string;
    public readonly created_at!: Date;
}

Maintenance.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        item: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        description: DataTypes.TEXT,
        category: DataTypes.ENUM('EMISSION', 'NON-EMISSION'),
        default_notes: DataTypes.TEXT,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'maintenances',
        timestamps: false,
    }
);
