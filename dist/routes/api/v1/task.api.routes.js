"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const task_model_1 = require("../../../models/task.model");
const taskAttachment_model_1 = require("../../../models/taskAttachment.model");
const task_validators_1 = require("../../../validators/task.validators");
const validation_middleware_1 = require("../../../middleware/validation.middleware");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const upload_middleware_1 = require("../../../middleware/upload.middleware");
const AppError_1 = require("../../../errors/AppError");
const promises_1 = __importDefault(require("fs/promises"));
const router = (0, express_1.Router)();
/*
    ==================================================
    GET ALL TASKS
    ==================================================

    GET /api/v1/tasks

    Pagination:

    GET /api/v1/tasks?page=1&limit=10

    Filtering:

    GET /api/v1/tasks?completed=true

    Search:

    GET /api/v1/tasks?search=node

    Combined:

    GET /api/v1/tasks?
        search=node&
        completed=false&
        page=1&
        limit=10
*/
router.get("/", auth_middleware_1.requireAuth, async (req, res, next) => {
    try {
        /*
                  ============================
                  PAGINATION
                  ============================
              */
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;
        /*
                  ============================
                  BASE WHERE CONDITION
                  ============================
              */
        const where = {
            userId: req.session.userId,
        };
        /*
                  ============================
                  COMPLETED FILTER
                  ============================
              */
        if (req.query.completed !== undefined) {
            if (req.query.completed !== "true" && req.query.completed !== "false") {
                throw new AppError_1.AppError("completed must be true or false", 400);
            }
            where.completed = req.query.completed === "true";
        }
        /*
                  ============================
                  SEARCH FILTER
                  ============================
              */
        if (typeof req.query.search === "string" &&
            req.query.search.trim() !== "") {
            const search = req.query.search.trim();
            where[sequelize_1.Op.or] = [
                {
                    title: {
                        [sequelize_1.Op.like]: `%${search}%`,
                    },
                },
                {
                    description: {
                        [sequelize_1.Op.like]: `%${search}%`,
                    },
                },
            ];
        }
        /*
                  ============================
                  DATABASE QUERY
                  ============================
              */
        const result = await task_model_1.Task.findAndCountAll({
            where,
            /*
                            Return only fields
                            required by the API.
                        */
            attributes: [
                "id",
                "title",
                "description",
                "completed",
                "createdAt",
                "updatedAt",
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(200).json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                totalItems: result.count,
                totalPages: Math.ceil(result.count / limit),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/*
    ==================================================
    GET TASK BY ID
    ==================================================

    GET /api/v1/tasks/:id
*/
router.get("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, async (req, res, next) => {
    try {
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId,
            },
            /*
                            Only return required fields.
                        */
            attributes: [
                "id",
                "title",
                "description",
                "completed",
                "createdAt",
                "updatedAt",
            ],
        });
        /*
                  ============================
                  TASK NOT FOUND
                  ============================
              */
        if (!task) {
            throw new AppError_1.AppError("Task not found", 404);
        }
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(200).json({
            success: true,
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
});
/*
    ==================================================
    CREATE TASK
    ==================================================

    POST /api/v1/tasks
*/
router.post("/", auth_middleware_1.requireAuth, task_validators_1.createTaskValidation, validation_middleware_1.handleValidationErrors, async (req, res, next) => {
    try {
        const { title, description } = req.body;
        /*
                  ============================
                  CREATE TASK
                  ============================
              */
        const task = await task_model_1.Task.create({
            title,
            description,
            completed: false,
            userId: req.session.userId,
        });
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/*
    ==================================================
    UPDATE TASK
    ==================================================

    PUT /api/v1/tasks/:id
*/
router.put("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, task_validators_1.updateTaskValidation, validation_middleware_1.handleValidationErrors, async (req, res, next) => {
    try {
        /*
                  ============================
                  FIND TASK
                  ============================
              */
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId,
            },
        });
        /*
                  ============================
                  TASK NOT FOUND
                  ============================
              */
        if (!task) {
            throw new AppError_1.AppError("Task not found", 404);
        }
        /*
                  ============================
                  UPDATE TASK
                  ============================
              */
        task.title = req.body.title;
        task.description = req.body.description;
        await task.save();
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: {
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/*
    ==================================================
    PARTIAL UPDATE TASK
    ==================================================

    PATCH /api/v1/tasks/:id
*/
router.patch("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, async (req, res, next) => {
    try {
        /*
                  ============================
                  FIND TASK
                  ============================
              */
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId,
            },
        });
        /*
                  ============================
                  TASK NOT FOUND
                  ============================
              */
        if (!task) {
            throw new AppError_1.AppError("Task not found", 404);
        }
        /*
                  ============================
                  TITLE
                  ============================
              */
        if (req.body.title !== undefined) {
            if (typeof req.body.title !== "string") {
                throw new AppError_1.AppError("Title must be a string", 400);
            }
            const title = req.body.title.trim();
            if (title.length === 0) {
                throw new AppError_1.AppError("Title is required", 400);
            }
            if (title.length > 255) {
                throw new AppError_1.AppError("Title cannot exceed 255 characters", 400);
            }
            task.title = title;
        }
        /*
                  ============================
                  DESCRIPTION
                  ============================
              */
        if (req.body.description !== undefined) {
            if (typeof req.body.description !== "string") {
                throw new AppError_1.AppError("Description must be a string", 400);
            }
            const description = req.body.description.trim();
            if (description.length === 0) {
                throw new AppError_1.AppError("Description is required", 400);
            }
            task.description = description;
        }
        /*
                  ============================
                  COMPLETED
                  ============================
              */
        if (req.body.completed !== undefined) {
            if (typeof req.body.completed !== "boolean") {
                throw new AppError_1.AppError("Completed must be a boolean", 400);
            }
            task.completed = req.body.completed;
        }
        /*
                  ============================
                  SAVE
                  ============================
              */
        await task.save();
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: {
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/*
    ==================================================
    DELETE TASK
    ==================================================

    DELETE /api/v1/tasks/:id
*/
router.delete("/:id", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, async (req, res, next) => {
    try {
        /*
                  ============================
                  FIND TASK
                  ============================
              */
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId,
            },
        });
        /*
                  ============================
                  TASK NOT FOUND
                  ============================
              */
        if (!task) {
            throw new AppError_1.AppError("Task not found", 404);
        }
        /*
                  ============================
                  DELETE
                  ============================
              */
        await task.destroy();
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
/*
    ==================================================
    UPLOAD TASK ATTACHMENT
    ==================================================

    POST /api/v1/tasks/:id/attachments

    Content-Type:

    multipart/form-data

    Field name:

    file
*/
router.post("/:id/attachments", auth_middleware_1.requireAuth, task_validators_1.taskIdValidation, validation_middleware_1.handleValidationErrors, upload_middleware_1.upload.single("file"), async (req, res, next) => {
    try {
        /*
                  ============================
                  FIND TASK
                  ============================
              */
        const task = await task_model_1.Task.findOne({
            where: {
                id: Number(req.params.id),
                userId: req.session.userId,
            },
        });
        /*
                  ============================
                  TASK NOT FOUND
                  ============================
              */
        if (!task) {
            /*
                        Remove uploaded file
                        if it already exists.
                    */
            if (req.file) {
                await promises_1.default.unlink(req.file.path).catch(() => { });
            }
            throw new AppError_1.AppError("Task not found", 404);
        }
        /*
                  ============================
                  FILE REQUIRED
                  ============================
              */
        if (!req.file) {
            throw new AppError_1.AppError("File is required", 400);
        }
        /*
                  ============================
                  SAVE FILE METADATA
                  ============================
              */
        const attachment = await taskAttachment_model_1.TaskAttachment.create({
            taskId: task.id,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
        });
        /*
                  ============================
                  RESPONSE
                  ============================
              */
        return res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                id: attachment.id,
                taskId: attachment.taskId,
                originalName: attachment.originalName,
                fileName: attachment.fileName,
                mimeType: attachment.mimeType,
                size: attachment.size,
                createdAt: attachment.createdAt,
            },
        });
    }
    catch (error) {
        /*
                  If database creation fails
                  after the file was saved,
                  remove the orphan file.
              */
        if (req.file) {
            await promises_1.default.unlink(req.file.path).catch(() => { });
        }
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=task.api.routes.js.map