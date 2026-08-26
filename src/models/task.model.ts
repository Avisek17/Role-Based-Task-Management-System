import {
    DataTypes,
    Model
} from "sequelize";

import { sequelize } from "../config/database";

export class Task extends Model {
    declare id: number;
    declare title: string;
    declare description: string;
    declare completed: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },

    {
        sequelize,
        tableName: "tasks",
        timestamps: true
    }
);