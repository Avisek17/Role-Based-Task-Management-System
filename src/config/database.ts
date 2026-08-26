import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "task_management",
    "root",
    "Avis3k@#",
    {
        host: "localhost",
        dialect: "mysql",
        logging: false
    }
);