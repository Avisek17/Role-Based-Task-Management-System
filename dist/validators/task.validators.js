"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskIdValidation = exports.updateTaskValidation = exports.createTaskValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createTaskValidation = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 255 })
        .withMessage("Title cannot exceed 255 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
];
exports.updateTaskValidation = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 255 })
        .withMessage("Title cannot exceed 255 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
];
exports.taskIdValidation = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Invalid task ID")
];
//# sourceMappingURL=task.validators.js.map