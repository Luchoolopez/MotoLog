import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MaintenancePlanAttributes {
    id: number;
    nombre: string;
    descripcion: string;
};

type MaintenancePlanCreationAttributes = Optional<MaintenancePlanAttributes, 'id'>;

export class MaintenancePlan extends Model<MaintenancePlanAttributes, MaintenancePlanCreationAttributes>
    implements MaintenancePlanAttributes {
    public id!: number;
    public nombre!: string;
    public descripcion!: string;
}

MaintenancePlan.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
    {
        sequelize,
        tableName: 'planes_mantenimiento',
        modelName: 'plan_mantenimiento',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)