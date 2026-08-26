"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
require("./models/task.model");
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const logger_1 = require("./middleware/logger");
const app = (0, express_1.default)();
const PORT = 3000;
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "..", "views"));
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use(logger_1.logger);
app.use("/tasks", task_routes_1.default);
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
        await database_1.sequelize.authenticate();
        console.log("Database connection successful");
        await database_1.sequelize.sync();
        console.log("Database synchronized");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Unable to connect to database:", error);
    }
}
startServer();
//# sourceMappingURL=app.js.map