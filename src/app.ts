import express from "express";
import path from "path";

import taskRoutes from "./routes/task.routes";
import { logger } from "./middleware/logger";

const app = express();

const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set(
    "views",
    path.join(__dirname, "..", "views")
);

// Built-in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);

// Custom middleware
app.use(logger);

// Routes
app.use("/tasks", taskRoutes);

// Home
app.get("/", (req, res) => {
    res.redirect("/tasks");
});

// 404
app.use((req, res) => {
    res.status(404).render("error", {
        message: "Page not found"
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});