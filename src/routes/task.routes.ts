import {
    Router,
    Request,
    Response
} from "express";

import { Task } from "../models/task.model";

import {
    createTaskValidation,
    updateTaskValidation,
    taskIdValidation
} from "../validators/task.validators";

import {
    handleValidationErrors
} from "../middleware/validation.middleware";

import {
    requireAuth
} from "../middleware/auth.middleware";

const router = Router();

/*
    GET ALL USER TASKS
*/
router.get(
    "/",
    requireAuth,
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const tasks = await Task.findAll({
                where: {
                    userId: req.session.userId
                },

                order: [
                    ["createdAt", "DESC"]
                ]
            });

            res.render(
                "tasks/index",
                {
                    tasks
                }
            );

        } catch (error) {

            console.error(
                "Fetch tasks error:",
                error
            );

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to fetch tasks"
                }
            );
        }
    }
);

/*
    CREATE TASK PAGE
*/
router.get(
    "/new",
    requireAuth,
    (
        req: Request,
        res: Response
    ) => {

        res.render("tasks/create");
    }
);

/*
    CREATE TASK
*/
router.post(
    "/",

    requireAuth,

    createTaskValidation,

    handleValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                title,
                description
            } = req.body;

            await Task.create({
                title,
                description,
                completed: false,

                userId:
                    req.session.userId!
            });

            res.redirect("/tasks");

        } catch (error) {

            console.error(
                "Create task error:",
                error
            );

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to create task"
                }
            );
        }
    }
);

/*
    GET EDIT PAGE
*/
router.get(
    "/:id/edit",

    requireAuth,

    taskIdValidation,

    handleValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task =
                await Task.findOne({
                    where: {
                        id:
                            Number(req.params.id),

                        userId:
                            req.session.userId
                    }
                });

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message:
                            "Task not found"
                    }
                );
            }

            res.render(
                "tasks/edit",
                {
                    task
                }
            );

        } catch (error) {

            console.error(
                "Get task error:",
                error
            );

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to fetch task"
                }
            );
        }
    }
);

/*
    UPDATE TASK
*/
router.post(
    "/:id",

    requireAuth,

    taskIdValidation,

    updateTaskValidation,

    handleValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task =
                await Task.findOne({
                    where: {
                        id:
                            Number(req.params.id),

                        userId:
                            req.session.userId
                    }
                });

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message:
                            "Task not found"
                    }
                );
            }

            task.title =
                req.body.title;

            task.description =
                req.body.description;

            await task.save();

            res.redirect("/tasks");

        } catch (error) {

            console.error(
                "Update task error:",
                error
            );

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to update task"
                }
            );
        }
    }
);

/*
    COMPLETE / UNCOMPLETE TASK
*/
router.post(
    "/:id/complete",

    requireAuth,

    taskIdValidation,

    handleValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task =
                await Task.findOne({
                    where: {
                        id:
                            Number(req.params.id),

                        userId:
                            req.session.userId
                    }
                });

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message:
                            "Task not found"
                    }
                );
            }

            task.completed =
                !task.completed;

            await task.save();

            res.redirect("/tasks");

        } catch (error) {

            console.error(
                "Complete task error:",
                error
            );

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to update task"
                }
            );
        }
    }
);

/*
    DELETE TASK
*/
router.post(
    "/:id/delete",

    requireAuth,

    taskIdValidation,

    handleValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task =
                await Task.findOne({
                    where: {
                        id:
                            Number(req.params.id),

                        userId:
                            req.session.userId
                    }
                });

            if (!task) {

                return res.status(404).render(
                    "error",
                    {
                        message:
                            "Task not found"
                    }
                );
            }

            await task.destroy();

            res.redirect("/tasks");

        } catch (error) {

            console.error(
                "Delete task error:",
                error
            );

            res.status(500).render(
                "error",
                {
                    message:
                        "Unable to delete task"
                }
            );
        }
    }
);

export default router;