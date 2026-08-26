import {
    Router,
    Request,
    Response
} from "express";

import { Task } from "../models/task.model";

const router = Router();

/*
    GET ALL USER TASKS
*/
router.get(
    "/",
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const tasks =
                await Task.findAll({
                    where: {
                        userId:
                            req.session.userId
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

            console.error(error);

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

            console.error(error);

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

            console.error(error);

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

            console.error(error);

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
    COMPLETE TASK
*/
router.post(
    "/:id/complete",
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

            console.error(error);

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

            console.error(error);

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