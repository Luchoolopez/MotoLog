import { DataTypes, Optional, Model } from "sequelize";
import { sequelize } from "../config/database";
import { allowsEval } from "zod/v4/core/util.cjs";

interface MotorcycleAttributes {
    id: number;
    marca: string;
    modelo: string;
    anio: number;
    patente: string;
    km_actual: number;
    fecha_compra: Date;
    plan_id: number;
    createdAt: Date;
    updatedAt: Date;
};

type MotorcycleCreationAttributes = Optional<MotorcycleAttributes, 'createdAt' | 'updatedAt'>;

export class Motorcycle extends Model<MotorcycleAttributes, MotorcycleCreationAttributes>
    implements MotorcycleAttributes {
    public id!: number;
    public marca!: string;
    public modelo!: string;
    public anio!: number;
    public patente!: string;
    public km_actual!: number;
    public fecha_compra!: Date;
    public plan_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
};

Motorcycle.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        marca:{
            type:DataTypes.STRING,
            allowNull:false
        },
        modelo:{
            type:DataTypes.STRING,
            allowNull:false
        },
        anio:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        patente:{
            type:DataTypes.STRING,
            allowNull:false
        },
        km_actual:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        fecha_compra:{
            type:DataTypes.DATE,
            allowNull:false
        },
        plan_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        createdAt:{
            type:DataTypes.DATE,
            defaultValue:DataTypes.NOW
        },
        updatedAt:{
            type:DataTypes.DATE,
            defaultValue:DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'motos',
        modelName: 'motorcycle',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

