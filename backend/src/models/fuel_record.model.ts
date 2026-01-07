import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface FuelRecordAttributes {
    id: number;
    moto_id: number;
    fecha: Date;
    litros: number;
    precio_por_litro: number;
    total: number;
    empresa: string;
    km_momento: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type FuelRecordCreationAttributes = Optional<FuelRecordAttributes, 'id' | 'createdAt' | 'updatedAt' | 'total'>;

export class FuelRecord extends Model<FuelRecordAttributes, FuelRecordCreationAttributes>
    implements FuelRecordAttributes {
    public id!: number;
    public moto_id!: number;
    public fecha!: Date;
    public litros!: number;
    public precio_por_litro!: number;
    public total!: number;
    public empresa!: string;
    public km_momento!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

FuelRecord.init(
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
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        litros: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        precio_por_litro: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        empresa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        km_momento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'registros_combustible',
        modelName: 'registros_combustible',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
