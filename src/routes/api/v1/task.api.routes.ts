import {
    Router,
    Request,
    Response
} from "express";

import {
    validationResult
} from "express-validator";

import { Task } from "../../../models/task.model";

import {
    createTaskValidation,
    updateTaskValidation,
    taskIdValidation,
    patchTaskValidation
} from "../../../validators/task.validators";

import { requireAuth } from "../../../middleware/auth.middleware";

const router = Router();


/*
    ============================
    VALIDATION ERROR HANDLER
    ============================
*/

const handleApiValidationErrors = (
    req: Request,
    res: Response,
    next: Function
) => {

    const errors = validationResult(req);

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

router.post(
    "/",

    requireAuth,

    createTaskValidation,

    handleApiValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                title,
                description
            } = req.body;

            const task = await Task.create({

                title,

                description,

                completed: false,

                userId:
                    req.session.userId!
            });

            return res.status(201).json({

                success: true,

                message:
                    "Task created successfully",

                data: task
            });

        } catch (error) {

            console.error(
                "API create task error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to create task"
            });
        }
    }
);


/*
    ============================
    GET ALL TASKS
    GET /api/v1/tasks
    ============================
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
                    userId:
                        req.session.userId
                },

                order: [
                    ["createdAt", "DESC"]
                ]
            });

            return res.status(200).json({

                success: true,

                data: tasks
            });

        } catch (error) {

            console.error(
                "API fetch tasks error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch tasks"
            });
        }
    }
);


/*
    ============================
    GET TASK BY ID
    GET /api/v1/tasks/:id
    ============================
*/

router.get(
    "/:id",

    requireAuth,

    taskIdValidation,

    handleApiValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task = await Task.findOne({

                where: {

                    id:
                        Number(req.params.id),

                    userId:
                        req.session.userId
                }
            });

            if (!task) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Task not found"
                });
            }

            return res.status(200).json({

                success: true,

                data: task
            });

        } catch (error) {

            console.error(
                "API get task error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch task"
            });
        }
    }
);


/*
    ============================
    UPDATE TASK
    PUT /api/v1/tasks/:id
    ============================
*/

router.put(
    "/:id",

    requireAuth,

    taskIdValidation,

    updateTaskValidation,

    handleApiValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task = await Task.findOne({

                where: {

                    id:
                        Number(req.params.id),

                    userId:
                        req.session.userId
                }
            });

            if (!task) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Task not found"
                });
            }

            task.title =
                req.body.title;

            task.description =
                req.body.description;

            await task.save();

            return res.status(200).json({

                success: true,

                message:
                    "Task updated successfully",

                data: task
            });

        } catch (error) {

            console.error(
                "API update task error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to update task"
            });
        }
    }
);


/*
    ============================
    PARTIAL UPDATE
    PATCH /api/v1/tasks/:id
    ============================
*/

router.patch(
    "/:id",

    requireAuth,

    taskIdValidation,

    patchTaskValidation,

    handleApiValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task = await Task.findOne({

                where: {

                    id:
                        Number(req.params.id),

                    userId:
                        req.session.userId
                }
            });

            if (!task) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Task not found"
                });
            }

            if (
                req.body.title !== undefined
            ) {
                task.title =
                    req.body.title;
            }

            if (
                req.body.description !== undefined
            ) {
                task.description =
                    req.body.description;
            }

            if (
                req.body.completed !== undefined
            ) {
                task.completed =
                    req.body.completed;
            }

            await task.save();

            return res.status(200).json({

                success: true,

                message:
                    "Task updated successfully",

                data: task
            });

        } catch (error) {

            console.error(
                "API patch task error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to update task"
            });
        }
    }
);


/*
    ============================
    DELETE TASK
    DELETE /api/v1/tasks/:id
    ============================
*/

router.delete(
    "/:id",

    requireAuth,

    taskIdValidation,

    handleApiValidationErrors,

    async (
        req: Request,
        res: Response
    ) => {

        try {

            const task = await Task.findOne({

                where: {

                    id:
                        Number(req.params.id),

                    userId:
                        req.session.userId
                }
            });

            if (!task) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Task not found"
                });
            }

            await task.destroy();

            return res.status(204).send();

        } catch (error) {

            console.error(
                "API delete task error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete task"
            });
        }
    }
);


export default router;