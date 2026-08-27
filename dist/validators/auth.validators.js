"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
];
exports.loginValidation = [
    (0, express_validator_1.body)("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
];
//# sourceMappingURL=auth.validators.js.map