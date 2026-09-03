import { body } from "express-validator";
export const registerValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
];
export const loginValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];
//# sourceMappingURL=auth.validators.js.map