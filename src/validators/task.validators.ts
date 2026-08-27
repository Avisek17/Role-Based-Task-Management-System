import { body, param } from "express-validator";

export const createTaskValidation = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({max:255})
    .withMessage("Title cannot exceed 255 characters"),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
]

export const updateTaskValidation = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({max:255})
    .withMessage("Title cannot exceed 255 characters"),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
]

export const taskIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid task ID")
];