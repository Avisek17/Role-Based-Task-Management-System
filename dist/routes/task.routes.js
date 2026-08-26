"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_model_1 = require("../models/task.model");
const router = (0, express_1.Router)();
// GET /tasks
// GET /tasks?status=completed
// GET /tasks?status=pending
router.get("/", async (req, res) => {
    try {
        const status = req.query.status;
        let tasks;
        if (status === "completed") {
            tasks = await task_model_1.Task.findAll({
                where: {
                    completed: true
                }
            });
        }
        else if (status === "pending") {
            tasks = await task_model_1.Task.findAll({
                where: {
                    completed: false
                }
            });
        }
        else {
            tasks = await task_model_1.Task.findAll();
        }
        res.render("tasks/index", {
            tasks,
            status
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to fetch tasks"
        });
    }
});
// GET /tasks/new
router.get("/new", (req, res) => {
    res.render("tasks/new");
});
// GET /tasks/:id
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const task = await task_model_1.Task.findByPk(id);
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        res.render("tasks/show", {
            task
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to fetch task"
        });
    }
});
// POST /tasks
router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).render("error", {
                message: "Title and description are required"
            });
        }
        await task_model_1.Task.create({
            title,
            description,
            completed: false
        });
        res.redirect("/tasks");
    }
    catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to create task"
        });
    }
});
// POST /tasks/:id/complete
router.post("/:id/complete", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const task = await task_model_1.Task.findByPk(id);
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        task.completed = true;
        await task.save();
        res.redirect(`/tasks/${id}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to complete task"
        });
    }
});
// POST /tasks/:id/delete
router.post("/:id/delete", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const task = await task_model_1.Task.findByPk(id);
        if (!task) {
            return res.status(404).render("error", {
                message: "Task not found"
            });
        }
        await task.destroy();
        res.redirect("/tasks");
    }
    catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to delete task"
        });
    }
});
exports.default = router;
//# sourceMappingURL=task.routes.js.map