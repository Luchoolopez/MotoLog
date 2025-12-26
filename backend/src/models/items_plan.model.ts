import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface itemsPlanAttributes {
    id: number;
    plan_id: number;
    tarea: string;
    intervalo_km: number;
    intervalo_meses: number;
    createdAt: Date;
    updatedAt: Date;
}

type itemsPlanCreationAttributes = Optional<itemsPlanAttributes, 'id' | 'updatedAt' | 'createdAt'>;

export class ItemsPlan extends Model<itemsPlanAttributes, itemsPlanCreationAttributes>
    implements itemsPlanAttributes {
    public id!: number;
    public plan_id!: number;
    public tarea!: string;
    public intervalo_km!: number;
    public intervalo_meses!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ItemsPlan.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        plan_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false
        },
        tarea: {
            type: DataTypes.STRING,
            allowNull: false
        },
        intervalo_km: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        intervalo_meses: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'items_plan',
        modelName: 'item_plan',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)