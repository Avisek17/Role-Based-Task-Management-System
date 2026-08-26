"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const role_middleware_1 = require("./middleware/role.middleware");
const app = (0, express_1.default)();
const PORT = 3000;
/*
    EJS
*/
app.set("view engine", "ejs");
app.set("views", path_1.default.join(process.cwd(), "views"));
/*
    BODY PARSER
*/
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.json());
/*
    STATIC FILES
*/
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
/*
    SESSION
*/
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET ||
        "development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    }
}));
/*
    SESSION DATA AVAILABLE
    TO EJS
*/
app.use((req, res, next) => {
    res.locals.userId =
        req.session.userId;
    res.locals.username =
        req.session.username;
    res.locals.role =
        req.session.role;
    next();
});
/*
    AUTH ROUTES
*/
app.use("/auth", auth_routes_1.default);
/*
    TASK ROUTES
    LOGIN REQUIRED
*/
app.use("/tasks", auth_middleware_1.requireAuth, task_routes_1.default);
/*
    ADMIN ROUTES
    LOGIN + ADMIN REQUIRED
*/
app.use("/admin", auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)("admin"), admin_routes_1.default);
/*
    HOME
*/
app.get("/", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/tasks");
    }
    res.redirect("/auth/login");
});
/*
    DATABASE + SERVER
*/
async function startServer() {
    try {
        await database_1.sequelize.authenticate();
        console.log("Database connection successful");
        await database_1.sequelize.sync({
            alter: true
        });
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