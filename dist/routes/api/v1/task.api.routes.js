"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_model_1 = require("../../../models/task.model");
const task_validators_1 = require("../../../validators/task.validators");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const router = (0, express_1.Router)();
/*
    ============================
    VALIDATION ERROR HANDLER
    ============================
*/
const handleApiValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};
/*
    ============================
    CREATE TASK
    POST /api/v1/tasks
    ============================
*/
router.post("/", auth_middleware_1.requireAuth, task_validators_1.createTaskValidation, handleApiValidationErrors, async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await task_model_1.Task.create({
            title,
            description,
            completed: false,
            userId: req.session.userId
        });
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    }
    catch (error) {
        console.error("API create task error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create task"
        });
    }
});
/*
    ============================
    GET ALL TASKS
    GET /api/v1/tasks
    ============================
*/
router.get("/", auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const tasks = await task_model_1.Task.findAll({
            where: {
                userId: req.session.userId
            },
            order: [
                ["createdAt", "DESC"]
            ]
        });
        return res.status(200).json({
            success: true,
            data: tasks
        });
    }
    catch (error) {
        console.error("API fetch tasks error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch tasks"
        });
    }
});
/*
    ============================
    GET TASK BY ID
    GET /api/v1/tasks/:id
    ============================
*/
router.get("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, handleApiValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: task
        });
    }
    catch (error) {
        console.error("API get task error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch task"
        });
    }
});
/*
    ============================
    UPDATE TASK
    PUT /api/v1/tasks/:id
    ============================
*/
router.put("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, task_validators_1.updateTaskValidation, handleApiValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        task.title =
            req.body.title;
        task.description =
            req.body.description;
        await task.save();
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    }
    catch (error) {
        console.error("API update task error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update task"
        });
    }
});
/*
    ============================
    PARTIAL UPDATE
    PATCH /api/v1/tasks/:id
    ============================
*/
router.patch("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, task_validators_1.patchTaskValidation, handleApiValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        if (req.body.title !== undefined) {
            task.title =
                req.body.title;
        }
        if (req.body.description !== undefined) {
            task.description =
                req.body.description;
        }
        if (req.body.completed !== undefined) {
            task.completed =
                req.body.completed;
        }
        await task.save();
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    }
    catch (error) {
        console.error("API patch task error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update task"
        });
    }
});
/*
    ============================
    DELETE TASK
    DELETE /api/v1/tasks/:id
    ============================
*/
router.delete("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, handleApiValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        await task.destroy();
        return res.status(204).send();
    }
    catch (error) {
        console.error("API delete task error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete task"
        });
    }
});
exports.default = router;
//# sourceMappingURL=task.api.routes.js.map