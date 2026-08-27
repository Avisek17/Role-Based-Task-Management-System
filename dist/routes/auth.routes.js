"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const auth_validators_1 = require("../validators/auth.validators");
const validation_middleware_1 = require("../middleware/validation.middleware");
const rate_limit_middleware_1 = require("../middleware/rate-limit.middleware");
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
router.post("/register", auth_validators_1.registerValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
    try {
        const { username, password } = req.body;
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
router.post("/login", rate_limit_middleware_1.loginLimiter, auth_validators_1.loginValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
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
        req.session.username = user.username;
        req.session.role = user.role;
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
            return res
                .status(500)
                .send("Unable to logout");
        }
        res.redirect("/auth/login");
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map