import {
    DataTypes,
    Model
} from "sequelize";

import { sequelize } from "../config/database";

export class User extends Model {
    declare id: number;

    declare username: string;

    declare password: string;

    declare role: "user" | "admin";

    declare createdAt: Date;

    declare updatedAt: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM(
                "user",
                "admin"
            ),
            defaultValue: "user",
            allowNull: false
        }
    },

    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
);