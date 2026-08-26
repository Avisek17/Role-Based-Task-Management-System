"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_1 = require("../data/tasks");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const status = req.query.status;
    let filteredTasks = tasks_1.tasks;
    if (status === "completed") {
        filteredTasks = tasks_1.tasks.filter(task => task.completed);
    }
    if (status === "pending") {
        filteredTasks = tasks_1.tasks.filter(task => !task.completed);
    }
    res.render("tasks/index", {
        tasks: filteredTasks,
        status
    });
});
router.get("/new", (req, res) => {
    res.render("tasks/new");
});
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks_1.tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).render("error", {
            message: "Task not found"
        });
    }
    res.render("tasks/show", {
        task
    });
});
router.post("/", (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).render("error", {
            message: "Title and description are required"
        });
    }
    const newTask = {
        id: tasks_1.tasks.length > 0
            ? Math.max(...tasks_1.tasks.map(task => task.id)) + 1
            : 1,
        title,
        description,
        completed: false
    };
    tasks_1.tasks.push(newTask);
    res.redirect("/tasks");
});
router.post("/:id/complete", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks_1.tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).render("error", {
            message: "Task not found"
        });
    }
    task.completed = true;
    res.redirect(`/tasks/${id}`);
});
router.post("/:id/delete", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks_1.tasks.findIndex(task => task.id === id);
    if (index === -1) {
        return res.status(404).render("error", {
            message: "Task not found"
        });
    }
    tasks_1.tasks.splice(index, 1);
    res.redirect("/tasks");
});
exports.default = router;
//# sourceMappingURL=task.routes.js.map