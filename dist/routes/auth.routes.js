"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const router = (0, express_1.Router)();
/*
    REGISTER PAGE
*/
router.get("/register", (req, res) => {
    res.render("auth/register");
});
/*
    REGISTER USER
*/
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).render("error", {
                message: "Username and password are required"
            });
        }
        const existingUser = await user_model_1.User.findOne({
            where: {
                username
            }
        });
        if (existingUser) {
            return res.status(400).render("error", {
                message: "Username already exists"
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await user_model_1.User.create({
            username,
            password: hashedPassword,
            role: "user"
        });
        res.redirect("/auth/login");
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).render("error", {
            message: "Registration failed"
        });
    }
});
/*
    LOGIN PAGE
*/
router.get("/login", (req, res) => {
    res.render("auth/login");
});
/*
    LOGIN USER
*/
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user_model_1.User.findOne({
            where: {
                username
            }
        });
        if (!user) {
            return res.status(401).render("error", {
                message: "Invalid username or password"
            });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).render("error", {
                message: "Invalid username or password"
            });
        }
        /*
            Create session
        */
        req.session.userId = user.id;
        req.session.username =
            user.username;
        req.session.role =
            user.role;
        res.redirect("/tasks");
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).render("error", {
            message: "Login failed"
        });
    }
});
/*
    LOGOUT
*/
router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.status(500).send("Unable to logout");
        }
        res.redirect("/auth/login");
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map