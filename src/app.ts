import "dotenv/config";

import express from "express";
import session from "express-session";
import path from "path";
import helmet from "helmet";
import cors from "cors";

import { sequelize } from "./config/database";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import adminRoutes from "./routes/admin.routes";

import { requireAuth } from "./middleware/auth.middleware";
import { requireRole } from "./middleware/role.middleware";

const app = express();

const PORT = 3000;

/*
    ============================
    SECURITY MIDDLEWARE
    ============================
*/

/*
    Helmet
*/
app.use(helmet());

/*
    CORS
*/
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

/*
    ============================
    VIEW ENGINE
    ============================
*/

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(process.cwd(), "views")
);

/*
    ============================
    BODY PARSER
    ============================
*/

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

/*
    ============================
    STATIC FILES
    ============================
*/

app.use(
    express.static(
        path.join(process.cwd(), "public")
    )
);

/*
    ============================
    SESSION
    ============================
*/

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "development-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60,

            httpOnly: true
        }
    })
);

/*
    ============================
    SESSION DATA FOR EJS
    ============================
*/

app.use(
    (req, res, next) => {

        res.locals.userId =
            req.session.userId;

        res.locals.username =
            req.session.username;

        res.locals.role =
            req.session.role;

        next();
    }
);

/*
    ============================
    AUTH ROUTES
    ============================
*/

app.use(
    "/auth",
    authRoutes
);

/*
    ============================
    TASK ROUTES
    ============================
*/

app.use(
    "/tasks",
    requireAuth,
    taskRoutes
);

/*
    ============================
    ADMIN ROUTES
    ============================
*/

app.use(
    "/admin",
    requireAuth,
    requireRole("admin"),
    adminRoutes
);

/*
    ============================
    HOME
    ============================
*/

app.get(
    "/",
    (req, res) => {

        if (req.session.userId) {
            return res.redirect("/tasks");
        }

        res.redirect("/auth/login");
    }
);

/*
    ============================
    DATABASE + SERVER
    ============================
*/

async function startServer() {

    try {

        await sequelize.authenticate();

        console.log(
            "Database connection successful"
        );

        await sequelize.sync({
            alter: true
        });

        console.log(
            "Database synchronized"
        );

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running at http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Unable to connect to database:",
            error
        );

    }
}

startServer();