"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_model_1 = require("../models/task.model");
const task_validators_1 = require("../validators/task.validators");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/*
    GET ALL USER TASKS
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
        res.render("tasks/index", {
            tasks
        });
    }
    catch (error) {
        console.error("Fetch tasks error:", error);
        res.status(500).render("error", {
            message: "Unable to fetch tasks"
        });
    }
});
/*
    CREATE TASK PAGE
*/
router.get("/new", auth_middleware_1.requireAuth, (req, res) => {
    res.render("tasks/create");
});
/*
    CREATE TASK
*/
router.post("/", auth_middleware_1.requireAuth, task_validators_1.createTaskValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
    try {
        const { title, description } = req.body;
        await task_model_1.Task.create({
            title,
            description,
            completed: false,
            userId: req.session.userId
        });
        res.redirect("/tasks");
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).render("error", {
            message: "Unable to create task"
        });
    }
});
/*
    GET EDIT PAGE
*/
router.get("/:id/edit", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        res.render("tasks/edit", {
            task
        });
    }
    catch (error) {
        console.error("Get task error:", error);
        res.status(500).render("error", {
            message: "Unable to fetch task"
        });
    }
});
/*
    UPDATE TASK
*/
router.post("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, task_validators_1.updateTaskValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        task.title =
            req.body.title;
        task.description =
            req.body.description;
        await task.save();
        res.redirect("/tasks");
    }
    catch (error) {
        console.error("Update task error:", error);
        res.status(500).render("error", {
            message: "Unable to update task"
        });
    }
});
/*
    COMPLETE / UNCOMPLETE TASK
*/
router.post("/:id/complete", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        task.completed =
            !task.completed;
        await task.save();
        res.redirect("/tasks");
    }
    catch (error) {
        console.error("Complete task error:", error);
        res.status(500).render("error", {
            message: "Unable to update task"
        });
    }
});
/*
    DELETE TASK
*/
router.post("/:id/delete", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, async (req, res) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId
            }
        });
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        await task.destroy();
        res.redirect("/tasks");
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(500).render("error", {
            message: "Unable to delete task"
        });
    }
});
exports.default = router;
//# sourceMappingURL=task.routes.js.map