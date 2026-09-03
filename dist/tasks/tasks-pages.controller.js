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
import { Body, Controller, Get, Param, Post, Req, Res, } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
let TasksPagesController = class TasksPagesController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    /*
      ============================
      TASK LIST
      ============================
    */
    async index(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            const tasks = await this.tasksService.findAll();
            return res.render('tasks/index', {
                tasks,
                username: req.session.username,
                role: req.session.role,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).render('error', {
                message: 'Unable to fetch tasks',
            });
        }
    }
    /*
      ============================
      CREATE TASK PAGE
      ============================
    */
    createPage(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        return res.render('tasks/create', {
            username: req.session.username,
            role: req.session.role,
        });
    }
    /*
      ============================
      CREATE TASK
      ============================
    */
    async create(req, body, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            await this.tasksService.create({
                title: body.title,
                description: body.description,
            });
            return res.redirect('/tasks');
        }
        catch (error) {
            console.error(error);
            return res.status(500).render('error', {
                message: 'Unable to create task',
            });
        }
    }
    /*
      ============================
      EDIT TASK PAGE
      ============================
    */
    async editPage(id, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            const task = await this.tasksService.findOne(Number(id));
            return res.render('tasks/edit', {
                task,
                username: req.session.username,
                role: req.session.role,
            });
        }
        catch (error) {
            return res.status(404).render('error', {
                message: 'Task not found',
            });
        }
    }
    /*
      ============================
      UPDATE TASK
      ============================
    */
    async update(id, body, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            await this.tasksService.update(Number(id), body);
            return res.redirect('/tasks');
        }
        catch (error) {
            return res.status(404).render('error', {
                message: 'Task not found',
            });
        }
    }
    /*
      ============================
      COMPLETE / UNCOMPLETE
      ============================
    */
    async complete(id, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            const task = await this.tasksService.findOne(Number(id));
            // This requires completed to exist in your entity.
            task.completed = !task.completed;
            await this.tasksService.save(task);
            return res.redirect('/tasks');
        }
        catch (error) {
            return res.status(404).render('error', {
                message: 'Task not found',
            });
        }
    }
    /*
      ============================
      DELETE TASK
      ============================
    */
    async delete(id, req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        try {
            await this.tasksService.delete(Number(id));
            return res.redirect('/tasks');
        }
        catch (error) {
            return res.status(404).render('error', {
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
], TasksPagesController.prototype, "index", null);
__decorate([
    Get('new'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TasksPagesController.prototype, "createPage", null);
__decorate([
    Post(),
    __param(0, Req()),
    __param(1, Body()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksPagesController.prototype, "create", null);
__decorate([
    Get(':id/edit'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksPagesController.prototype, "editPage", null);
__decorate([
    Post(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksPagesController.prototype, "update", null);
__decorate([
    Post(':id/complete'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksPagesController.prototype, "complete", null);
__decorate([
    Post(':id/delete'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TasksPagesController.prototype, "delete", null);
TasksPagesController = __decorate([
    Controller('tasks'),
    __metadata("design:paramtypes", [TasksService])
], TasksPagesController);
export { TasksPagesController };
//# sourceMappingURL=tasks-pages.controller.js.map