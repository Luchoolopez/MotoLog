import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MaintenanceHistoryConsumptionAttributes {
    id: number;
    maintenance_history_id: number;
    warehouse_item_id: number;
    cantidad_usada: number;
}

type MaintenanceHistoryConsumptionCreationAttributes = Optional<MaintenanceHistoryConsumptionAttributes, 'id'>;

export class MaintenanceHistoryConsumption extends Model<MaintenanceHistoryConsumptionAttributes, MaintenanceHistoryConsumptionCreationAttributes>
    implements MaintenanceHistoryConsumptionAttributes {
    public id!: number;
    public maintenance_history_id!: number;
    public warehouse_item_id!: number;
    public cantidad_usada!: number;
}

MaintenanceHistoryConsumption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        maintenance_history_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'maintenance_history_id'
        },
        warehouse_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'warehouse_item_id'
        },
        cantidad_usada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'cantidad_usada'
        }
    },
    {
        sequelize,
        tableName: 'historial_mantenimiento_consumo',
        modelName: 'MaintenanceHistoryConsumption',
        timestamps: false,
        freezeTableName: true
    }
);
