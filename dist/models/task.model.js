"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = require("./user.model");
const database_1 = require("../config/database");
class Task extends sequelize_1.Model {
}
exports.Task = Task;
Task.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    completed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: "tasks",
    timestamps: true
});
user_model_1.User.hasMany(Task, {
    foreignKey: "userId",
    as: "tasks"
});
Task.belongsTo(user_model_1.User, {
    foreignKey: "userId",
    as: "user"
});
//# sourceMappingURL=task.model.js.map