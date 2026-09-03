import { Router, Request, Response, NextFunction } from "express";

import { Op } from "sequelize";

import { Task } from "../../../../legacy-express/models/task.model";

import { TaskAttachment } from "../../../../legacy-express/models/taskAttachment.model";

import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
} from "../../../../legacy-express/validators/task.validators";

import { handleValidationErrors } from "../../../../legacy-express/middleware/validation.middleware";

import { requireAuth } from "../../../../legacy-express/middleware/auth.middleware";

import { upload } from "../../../../legacy-express/middleware/upload.middleware";

import { AppError } from "../../../errors/AppError";

import fs from "fs/promises";

const router = Router();

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

router.get(
  "/",

  requireAuth,

  async (req: Request, res: Response, next: NextFunction) => {
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

      const where: any = {
        userId: req.session.userId,
      };

      /*
                ============================
                COMPLETED FILTER
                ============================
            */

      if (req.query.completed !== undefined) {
        if (req.query.completed !== "true" && req.query.completed !== "false") {
          throw new AppError("completed must be true or false", 400);
        }

        where.completed = req.query.completed === "true";
      }

      /*
                ============================
                SEARCH FILTER
                ============================
            */

      if (
        typeof req.query.search === "string" &&
        req.query.search.trim() !== ""
      ) {
        const search = req.query.search.trim();

        where[Op.or] = [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },

          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
      }

      /*
                ============================
                DATABASE QUERY
                ============================
            */

      const result = await Task.findAndCountAll({
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
    } catch (error) {
      next(error);
    }
  },
);

/*
    ==================================================
    GET TASK BY ID
    ==================================================

    GET /api/v1/tasks/:id
*/

router.get(
  "/:id",

  requireAuth,

  taskIdValidation,

  handleValidationErrors,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await Task.findOne({
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
        throw new AppError("Task not found", 404);
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
    } catch (error) {
      next(error);
    }
  },
);

/*
    ==================================================
    CREATE TASK
    ==================================================

    POST /api/v1/tasks
*/

router.post(
  "/",

  requireAuth,

  createTaskValidation,

  handleValidationErrors,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;

      /*
                ============================
                CREATE TASK
                ============================
            */

      const task = await Task.create({
        title,

        description,

        completed: false,

        userId: req.session.userId!,
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
    } catch (error) {
      next(error);
    }
  },
);

/*
    ==================================================
    UPDATE TASK
    ==================================================

    PUT /api/v1/tasks/:id
*/

router.put(
  "/:id",

  requireAuth,

  taskIdValidation,

  updateTaskValidation,

  handleValidationErrors,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*
                ============================
                FIND TASK
                ============================
            */

      const task = await Task.findOne({
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
        throw new AppError("Task not found", 404);
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
    } catch (error) {
      next(error);
    }
  },
);

/*
    ==================================================
    PARTIAL UPDATE TASK
    ==================================================

    PATCH /api/v1/tasks/:id
*/

router.patch(
  "/:id",

  requireAuth,

  taskIdValidation,

  handleValidationErrors,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*
                ============================
                FIND TASK
                ============================
            */

      const task = await Task.findOne({
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
        throw new AppError("Task not found", 404);
      }

      /*
                ============================
                TITLE
                ============================
            */

      if (req.body.title !== undefined) {
        if (typeof req.body.title !== "string") {
          throw new AppError("Title must be a string", 400);
        }

        const title = req.body.title.trim();

        if (title.length === 0) {
          throw new AppError("Title is required", 400);
        }

        if (title.length > 255) {
          throw new AppError("Title cannot exceed 255 characters", 400);
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
          throw new AppError("Description must be a string", 400);
        }

        const description = req.body.description.trim();

        if (description.length === 0) {
          throw new AppError("Description is required", 400);
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
          throw new AppError("Completed must be a boolean", 400);
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
    } catch (error) {
      next(error);
    }
  },
);

/*
    ==================================================
    DELETE TASK
    ==================================================

    DELETE /api/v1/tasks/:id
*/

router.delete(
  "/:id",

  requireAuth,

  taskIdValidation,

  handleValidationErrors,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*
                ============================
                FIND TASK
                ============================
            */

      const task = await Task.findOne({
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
        throw new AppError("Task not found", 404);
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
    } catch (error) {
      next(error);
    }
  },
);

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

router.post(
  "/:id/attachments",

  requireAuth,

  taskIdValidation,

  handleValidationErrors,

  upload.single("file"),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /*
                ============================
                FIND TASK
                ============================
            */

      const task = await Task.findOne({
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
          await fs.unlink(req.file.path).catch(() => {});
        }

        throw new AppError("Task not found", 404);
      }

      /*
                ============================
                FILE REQUIRED
                ============================
            */

      if (!req.file) {
        throw new AppError("File is required", 400);
      }

      /*
                ============================
                SAVE FILE METADATA
                ============================
            */

      const attachment = await TaskAttachment.create({
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
    } catch (error) {
      /*
                If database creation fails
                after the file was saved,
                remove the orphan file.
            */

      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      next(error);
    }
  },
);

export default router;
