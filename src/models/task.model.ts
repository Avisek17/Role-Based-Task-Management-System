import {
    DataTypes,
    Model
} from "sequelize";
import { User } from "./user.model";
import { sequelize } from "../config/database";

export class Task extends Model {
    declare id: number;
    declare title: string;
    declare description: string;
    declare completed: boolean;
    declare userId: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },

    {
        sequelize,
        tableName: "tasks",
        timestamps: true
    }
);

User.hasMany(Task, {
    foreignKey: "userId",
    as: "tasks"
});

Task.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});