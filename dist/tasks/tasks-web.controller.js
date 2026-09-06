var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Catch, Controller, Get, Param, Post, Req, Res, UploadedFile, UseFilters, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/updata-task.dto.js';
// =====================================================
// FILE VALIDATION CONFIGURATION
// =====================================================
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
];
const ALLOWED_EXTENSIONS = [
    '.pdf',
    '.doc',
    '.docx',
    '.jpg',
    '.jpeg',
    '.png',
];
// =====================================================
// CUSTOM FILE UPLOAD ERROR
// =====================================================
class FileUploadError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileUploadError';
    }
}
// =====================================================
// WEB FILE UPLOAD EXCEPTION FILTER
// =====================================================
let WebFileUploadExceptionFilter = class WebFileUploadExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode = 400;
        let message = 'Unable to upload file.';
        // -----------------------------------------------
        // MULTER ERROR
        // -----------------------------------------------
        if (exception instanceof multer.MulterError) {
            if (exception.code === 'LIMIT_FILE_SIZE') {
                statusCode = 413;
                message =
                    'File too large. Maximum allowed size is 5 MB.';
            }
            else {
                message =
                    'File upload failed.';
            }
        }
        // -----------------------------------------------
        // CUSTOM FILE VALIDATION ERROR
        // -----------------------------------------------
        else if (exception instanceof FileUploadError) {
            message =
                exception.message;
        }
        // -----------------------------------------------
        // RENDER EJS ERROR PAGE
        // -----------------------------------------------
        return response
            .status(statusCode)
            .render('error', {
            message,
        });
    }
};
WebFileUploadExceptionFilter = __decorate([
    Catch(multer.MulterError, FileUploadError)
], WebFileUploadExceptionFilter);
export { WebFileUploadExceptionFilter };
// =====================================================
// FILE UPLOAD OPTIONS
// =====================================================
const fileUploadOptions = {
    storage: diskStorage({
        destination: './public/uploads/tasks',
        filename: (req, file, callback) => {
            const extension = path
                .extname(file.originalname)
                .toLowerCase();
            const filename = `${crypto.randomUUID()}${extension}`;
            callback(null, filename);
        },
    }),
    // -----------------------------------------------
    // MAXIMUM FILE SIZE
    // -----------------------------------------------
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    // -----------------------------------------------
    // FILE TYPE + EXTENSION VALIDATION
    // -----------------------------------------------
    fileFilter: (req, file, callback) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();
        // Check MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return callback(new FileUploadError('Invalid file type. Allowed files: PDF, DOC, DOCX, JPG, JPEG, PNG.'), false);
        }
        // Check extension
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return callback(new FileUploadError('Invalid file extension.'), false);
        }
        callback(null, true);
    },
};
// =====================================================
// CONTROLLER
// =====================================================
let TasksWebController = class TasksWebController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    // =====================================================
    // GET /tasks
    // =====================================================
    async index(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            const tasks = await this.tasksService.findAllByUser(req.session.userId);
            return res.render('tasks/index', {
                username: req.session.username,
                role: req.session.role,
                tasks,
            });
        }
        catch (error) {
            console.error('Fetch tasks error:', error);
            return res
                .status(500)
                .render('error', {
                message: 'Unable to fetch tasks',
            });
        }
    }
    // =====================================================
    // GET /tasks/new
    // =====================================================
    createPage(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        return res.render('tasks/create', {
            username: req.session.username,
            role: req.session.role,
        });
    }
    // =====================================================
    // POST /tasks
    // CREATE TASK + FILE
    // =====================================================
    async create(req, body, res, file) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            console.log('========== CREATE TASK ==========');
            console.log('Title:', body.title);
            console.log('Description:', body.description);
            console.log('User ID:', req.session.userId);
            console.log('Uploaded file:', file);
            await this.tasksService.createForUser(body, req.session.userId, file);
            return res.redirect('/tasks');
        }
        catch (error) {
            console.error('Create task error:', error);
            return res
                .status(500)
                .render('error', {
                message: 'Unable to create task',
            });
        }
    }
    // =====================================================
    // GET /tasks/:id/edit
    // =====================================================
    async editPage(id, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            const task = await this.tasksService.findOneByUser(Number(id), req.session.userId);
            return res.render('tasks/edit', {
                username: req.session.username,
                role: req.session.role,
                task,
            });
        }
        catch (error) {
            console.error('Fetch task for edit error:', error);
            return res
                .status(404)
                .render('error', {
                message: 'Task not found',
            });
        }
    }
    // =====================================================
    // POST /tasks/:id
    // UPDATE TASK + REPLACE FILE
    // =====================================================
    async update(id, body, req, res, file) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            console.log('========== UPDATE TASK ==========');
            console.log('Task ID:', id);
            console.log('Body:', body);
            console.log('Uploaded file:', file);
            await this.tasksService.updateForUser(Number(id), body, req.session.userId, file);
            return res.redirect('/tasks');
        }
        catch (error) {
            console.error('Update task error:', error);
            return res
                .status(404)
                .render('error', {
                message: 'Task not found',
            });
        }
    }
    // =====================================================
    // POST /tasks/:id/complete
    // =====================================================
    async complete(id, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            await this.tasksService.toggleComplete(Number(id), req.session.userId);
            return res.redirect('/tasks');
        }
        catch (error) {
            console.error('Complete task error:', error);
            return res
                .status(404)
                .render('error', {
                message: 'Task not found',
            });
        }
    }
    // =====================================================
    // POST /tasks/:id/delete
    // =====================================================
    async delete(id, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            await this.tasksService.deleteForUser(Number(id), req.session.userId);
            return res.redirect('/tasks');
        }
        catch (error) {
            console.error('Delete task error:', error);
            return res
                .status(404)
                .render('error', {
                message: 'Task not found',
            });
        }
    }
};
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWebController.prototype, "index", null);
__decorate([
    Get('new'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TasksWebController.prototype, "createPage", null);
__decorate([
    Post(),
    UseFilters(WebFileUploadExceptionFilter),
    UseInterceptors(FileInterceptor('attachment', fileUploadOptions)),
    __param(0, Req()),
    __param(1, Body()),
    __param(2, Res()),
    __param(3, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateTaskDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWebController.prototype, "create", null);
__decorate([
    Get(':id/edit'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWebController.prototype, "editPage", null);
__decorate([
    Post(':id'),
    UseFilters(WebFileUploadExceptionFilter),
    UseInterceptors(FileInterceptor('attachment', fileUploadOptions)),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __param(3, Res()),
    __param(4, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTaskDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWebController.prototype, "update", null);
__decorate([
    Post(':id/complete'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWebController.prototype, "complete", null);
__decorate([
    Post(':id/delete'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksWebController.prototype, "delete", null);
TasksWebController = __decorate([
    Controller('tasks'),
    __metadata("design:paramtypes", [TasksService])
], TasksWebController);
export { TasksWebController };
//# sourceMappingURL=tasks-web.controller.js.map