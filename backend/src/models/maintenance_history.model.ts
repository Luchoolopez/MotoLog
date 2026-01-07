import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MaintenanceHistoryAttributes {
    id: number;
    moto_id: number;
    item_plan_id: number;
    fecha_realizado: Date;
    km_realizado: number;
    observaciones?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

type MaintenanceHistoryCreationAttributes = Optional<MaintenanceHistoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'observaciones'>;

export class MaintenanceHistory extends Model<MaintenanceHistoryAttributes, MaintenanceHistoryCreationAttributes>
    implements MaintenanceHistoryAttributes {
    public id!: number;
    public moto_id!: number;
    public item_plan_id!: number;
    public fecha_realizado!: Date;
    public km_realizado!: number;
    public observaciones!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

MaintenanceHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        moto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_realizado: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        km_realizado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    },
    {
        sequelize,
        tableName: 'historial_mantenimiento',
        modelName: 'MaintenanceHistory',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)