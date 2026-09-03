import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Task } from "./task.model";

export class TaskAttachment extends Model{

declare id: number;
declare taskId: number;
declare originalName: string;
declare fileName: string;
declare filePath: string;
declare mimeType: string; 
declare size: number;
declare createdAt: Date;
declare updatedAt: Date;
}

TaskAttachment.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    taskId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        originalName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fileName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        filePath: {
            type: DataTypes.STRING,
            allowNull: false
        },

        mimeType: {
            type: DataTypes.STRING,
            allowNull: false
        },

        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
},
{
        sequelize,
        tableName: "task_attachments",
        timestamps: true
    }
)

Task.hasMany(TaskAttachment, {
    foreignKey: "taskId",
    as: "attachments"
});

TaskAttachment.belongsTo(Task, {
    foreignKey: "taskId",
    as: "task"
});