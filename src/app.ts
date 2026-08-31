import "dotenv/config";

/*
    Load models before sequelize.sync()
*/
import "./models/taskAttachment.model";

import express from "express";
import session from "express-session";
import path from "path";
import helmet from "helmet";
import cors from "cors";

import { sequelize } from "./config/database";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import adminRoutes from "./routes/admin.routes";
import taskApiRoutes from "./routes/api/v1/task.api.routes";

import { requireAuth } from "./middleware/auth.middleware";
import { requireRole } from "./middleware/role.middleware";
import { errorHandler } from "./middleware/error.middleware";

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

    credentials: true,
  }),
);

/*
    ============================
    VIEW ENGINE
    ============================
*/

app.set("view engine", "ejs");

app.set("views", path.join(process.cwd(), "views"));

/*
    ============================
    BODY PARSER
    ============================
*/

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());

/*
    ============================
    STATIC FILES
    ============================
*/

/*
    Public files
*/
app.use(express.static(path.join(process.cwd(), "public")));

/*
    Uploaded files
*/
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/*
    ============================
    SESSION
    ============================
*/

app.use(
  session({
    secret: process.env.SESSION_SECRET || "development-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60,

      httpOnly: true,
    },
  }),
);

/*
    ============================
    SESSION DATA FOR EJS
    ============================
*/

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;

  res.locals.username = req.session.username;

  res.locals.role = req.session.role;

  next();
});

/*
    ============================
    AUTH ROUTES
    ============================
*/

app.use("/auth", authRoutes);

/*
    ============================
    TASK WEB ROUTES
    ============================
*/

app.use("/tasks", requireAuth, taskRoutes);

/*
    ============================
    TASK REST API
    ============================
*/

app.use("/api/v1/tasks", taskApiRoutes);

/*
    ============================
    ADMIN ROUTES
    ============================
*/

app.use("/admin", requireAuth, requireRole("admin"), adminRoutes);

/*
    ============================
    HOME
    ============================
*/

app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/tasks");
  }

  return res.redirect("/auth/login");
});

/*
    ============================
    404 HANDLER
    ============================
*/

app.use((req, res) => {
  /*
            REST API requests
            receive JSON.
        */

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({
      success: false,

      message: "Route not found",
    });
  }

  /*
            Normal web requests
        */

  return res.status(404).render("error", {
    message: "Page not found",
  });
});

/*
    ============================
    CENTRALIZED ERROR HANDLER
    ============================
*/

app.use(errorHandler);

/*
    ============================
    DATABASE + SERVER
    ============================
*/

async function startServer() {
  try {
    /*
            Test database connection
        */

    await sequelize.authenticate();

    console.log("Database connection successful");

    /*
            Synchronize models
        */

    await sequelize.sync({
      alter: true,
    });

    console.log("Database synchronized");

    /*
            Start server
        */

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

startServer();
