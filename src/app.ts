import express from "express";
import path from "path";

import { sequelize } from "./config/database";
import "./models/task.model";

import taskRoutes from "./routes/task.routes";
import { logger } from "./middleware/logger";

const app = express();

const PORT = 3000;

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "..", "views")
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);

app.use(logger);

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.redirect("/tasks");
});

app.use((req, res) => {
    res.status(404).render("error", {
        message: "Page not found"
    });
});

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log(
            "Database connection successful"
        );

        await sequelize.sync();

        console.log(
            "Database synchronized"
        );

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Unable to connect to database:",
            error
        );
    }
}

startServer();