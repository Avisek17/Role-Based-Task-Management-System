"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAttachment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const task_model_1 = require("./task.model");
class TaskAttachment extends sequelize_1.Model {
}
exports.TaskAttachment = TaskAttachment;
TaskAttachment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    taskId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    originalName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    fileName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    mimeType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: "task_attachments",
    timestamps: true
});
task_model_1.Task.hasMany(TaskAttachment, {
    foreignKey: "taskId",
    as: "attachments"
});
TaskAttachment.belongsTo(task_model_1.Task, {
    foreignKey: "taskId",
    as: "task"
});
//# sourceMappingURL=taskAttachment.model.js.map