"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const logger_1 = require("./middleware/logger");
const app = (0, express_1.default)();
const PORT = 3000;
// EJS
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "..", "views"));
// Built-in middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Static files
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
// Custom middleware
app.use(logger_1.logger);
// Routes
app.use("/tasks", task_routes_1.default);
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
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map