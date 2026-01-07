import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface WarehouseItemAttributes {
    id: number;
    user_id: number;
    nro_parte: string | null;
    nombre: string;
    categoria: 'Repuesto' | 'Accesorio' | 'Sistemático';
    fecha_compra: Date;
    precio_compra: number;
    lugar_compra: string | null;
    cantidad: number;
    stock_actual: number;
    modelo_moto: string | null;
    observaciones: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type WarehouseItemCreationAttributes = Optional<WarehouseItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'nro_parte' | 'lugar_compra' | 'observaciones' | 'stock_actual' | 'modelo_moto'>;

export class WarehouseItem extends Model<WarehouseItemAttributes, WarehouseItemCreationAttributes>
    implements WarehouseItemAttributes {
    public id!: number;
    public user_id!: number;
    public nro_parte!: string | null;
    public nombre!: string;
    public categoria!: 'Repuesto' | 'Accesorio' | 'Sistemático';
    public fecha_compra!: Date;
    public precio_compra!: number;
    public lugar_compra!: string | null;
    public cantidad!: number;
    public stock_actual!: number;
    public modelo_moto!: string | null;
    public observaciones!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

WarehouseItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nro_parte: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoria: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        fecha_compra: {
            type: DataTypes.DATE,
            allowNull: false
        },
        precio_compra: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        lugar_compra: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        stock_actual: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        modelo_moto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'almacen_items',
        modelName: 'WarehouseItem',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
