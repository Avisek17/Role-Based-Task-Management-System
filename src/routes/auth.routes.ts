import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/user.model";

import {
    loginValidation,
    registerValidation
} from "../validators/auth.validators";

import {
    handleValidationErrors
} from "../middleware/validation.middleware";

import {
    loginLimiter
} from "../middleware/rate-limit.middleware";

const router = Router();

/*
    REGISTER PAGE
*/
router.get(
    "/register",
    (req: Request, res: Response) => {
        res.render("auth/register");
    }
);

/*
    REGISTER USER
*/
router.post(
    "/register",

    registerValidation,

    handleValidationErrors,

    async (req: Request, res: Response) => {

        try {

            const { username, password } = req.body;

            const existingUser = await User.findOne({
                where: {
                    username
                }
            });

            if (existingUser) {
                return res.status(400).render("error", {
                    message: "Username already exists"
                });
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            await User.create({
                username,
                password: hashedPassword,
                role: "user"
            });

            res.redirect("/auth/login");

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            res.status(500).render("error", {
                message: "Registration failed"
            });
        }
    }
);

/*
    LOGIN PAGE
*/
router.get(
    "/login",
    (req: Request, res: Response) => {
        res.render("auth/login");
    }
);

/*
    LOGIN USER
*/
router.post(
    "/login",

    loginLimiter,

    loginValidation,

    handleValidationErrors,

    async (req: Request, res: Response) => {

        try {

            const { username, password } = req.body;

            const user = await User.findOne({
                where: {
                    username
                }
            });

            if (!user) {
                return res.status(401).render("error", {
                    message:
                        "Invalid username or password"
                });
            }

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                return res.status(401).render("error", {
                    message:
                        "Invalid username or password"
                });
            }

            /*
                Create session
            */

            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;

            res.redirect("/tasks");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            res.status(500).render("error", {
                message: "Login failed"
            });
        }
    }
);

/*
    LOGOUT
*/
router.post(
    "/logout",
    (req: Request, res: Response) => {

        req.session.destroy((error) => {

            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return res
                    .status(500)
                    .send("Unable to logout");
            }

            res.redirect("/auth/login");
        });
    }
);

export default router;