import { DataTypes, Optional, Model } from "sequelize";
import { sequelize } from "../config/database";

import { Motorcycle } from "./motorcycle.model";

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //asociaciones
    public motos?: Motorcycle[];
};

User.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'user',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)