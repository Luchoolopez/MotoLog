import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface itemsPlanAttributes {
    id: number;
    plan_id: number;
    tarea: string;
    intervalo_km: number;
    intervalo_meses: number;
    consumo_sistematico?: boolean;
    tipo: 'Inspección' | 'Cambio' | 'Limpieza' | 'Lubricación' | 'Ajuste';
    createdAt?: Date;
    updatedAt?: Date;
}

type itemsPlanCreationAttributes = Optional<itemsPlanAttributes, 'id' | 'updatedAt' | 'createdAt'>;

export class ItemsPlan extends Model<itemsPlanAttributes, itemsPlanCreationAttributes>
    implements itemsPlanAttributes {
    public id!: number;
    public plan_id!: number;
    public tarea!: string;
    public intervalo_km!: number;
    public intervalo_meses!: number;
    public consumo_sistematico!: boolean;
    public tipo!: 'Inspección' | 'Cambio' | 'Limpieza' | 'Lubricación' | 'Ajuste';
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
            allowNull: false
        },
        tarea: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('Inspección', 'Cambio', 'Limpieza', 'Lubricación', 'Ajuste'),
            allowNull: false,
            defaultValue: 'Inspección'
        },
        intervalo_km: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        intervalo_meses: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        consumo_sistematico: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'items_plan',
        modelName: 'ItemsPlan',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)