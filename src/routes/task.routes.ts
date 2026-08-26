import {
    Router,
    Request,
    Response
} from "express";

import { Task } from "../models/task.model";

const router = Router();


// GET /tasks
// GET /tasks?status=completed
// GET /tasks?status=pending

router.get(
    "/",
    async (req: Request, res: Response) => {

        try {
            const status = req.query.status;

            let tasks;

            if (status === "completed") {

                tasks = await Task.findAll({
                    where: {
                        completed: true
                    }
                });

            } else if (status === "pending") {

                tasks = await Task.findAll({
                    where: {
                        completed: false
                    }
                });

            } else {

                tasks = await Task.findAll();

            }

            res.render("tasks/index", {
                tasks,
                status
            });

        } catch (error) {

            console.error(error);

            res.status(500).render("error", {
                message: "Failed to fetch tasks"
            });
        }
    }
);


// GET /tasks/new

router.get(
    "/new",
    (req: Request, res: Response) => {

        res.render("tasks/new");

    }
);


// GET /tasks/:id

router.get(
    "/:id",
    async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const task = await Task.findByPk(id);

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message: "Task not found"
                    }
                );

            }

            res.render("tasks/show", {
                task
            });

        } catch (error) {

            console.error(error);

            res.status(500).render("error", {
                message: "Failed to fetch task"
            });
        }
    }
);


// POST /tasks

router.post(
    "/",
    async (req: Request, res: Response) => {

        try {

            const {
                title,
                description
            } = req.body;

            if (!title || !description) {

                return res.status(400).render(
                    "error",
                    {
                        message:
                            "Title and description are required"
                    }
                );

            }

            await Task.create({
                title,
                description,
                completed: false
            });

            res.redirect("/tasks");

        } catch (error) {

            console.error(error);

            res.status(500).render("error", {
                message: "Failed to create task"
            });
        }
    }
);


// POST /tasks/:id/complete

router.post(
    "/:id/complete",
    async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const task = await Task.findByPk(id);

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message: "Task not found"
                    }
                );

            }

            task.completed = true;

            await task.save();

            res.redirect(`/tasks/${id}`);

        } catch (error) {

            console.error(error);

            res.status(500).render("error", {
                message: "Failed to complete task"
            });
        }
    }
);


// POST /tasks/:id/delete

router.post(
    "/:id/delete",
    async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const task = await Task.findByPk(id);

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message: "Task not found"
                    }
                );

            }

            await task.destroy();

            res.redirect("/tasks");

        } catch (error) {

            console.error(error);

            res.status(500).render("error", {
                message: "Failed to delete task"
            });
        }
    }
);


export default router;