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
export const patchTaskValidation = [

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 255 })
        .withMessage(
            "Title cannot exceed 255 characters"
        ),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Description cannot be empty"
        ),

    body("completed")
        .optional()
        .isBoolean()
        .withMessage(
            "Completed must be a boolean"
        )
        .toBoolean()
];