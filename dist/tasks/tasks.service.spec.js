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
import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity.js';
let TasksService = class TasksService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async findAll() {
        return this.taskRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findAllByUser(userId) {
        return this.taskRepository.find({
            where: {
                userId,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findOne(id) {
        const task = await this.taskRepository.findOne({
            where: {
                id,
            },
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    async findOneByUser(id, userId) {
        const task = await this.taskRepository.findOne({
            where: {
                id,
                userId,
            },
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    async create(createTaskDto) {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
        });
        return this.taskRepository.save(task);
    }
    async createForUser(createTaskDto, userId) {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            userId,
            completed: false,
        });
        return this.taskRepository.save(task);
    }
    async update(id, updateTaskDto) {
        const task = await this.findOne(id);
        if (updateTaskDto.title !== undefined) {
            task.title = updateTaskDto.title;
        }
        if (updateTaskDto.description !== undefined) {
            task.description = updateTaskDto.description;
        }
        return this.taskRepository.save(task);
    }
    async updateForUser(id, updateTaskDto, userId) {
        const task = await this.findOneByUser(id, userId);
        if (updateTaskDto.title !== undefined) {
            task.title = updateTaskDto.title;
        }
        if (updateTaskDto.description !== undefined) {
            task.description = updateTaskDto.description;
        }
        return this.taskRepository.save(task);
    }
    async toggleComplete(id, userId) {
        const task = await this.findOneByUser(id, userId);
        task.completed = !task.completed;
        return this.taskRepository.save(task);
    }
    async delete(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
        return {
            message: 'Task deleted successfully',
        };
    }
    async deleteForUser(id, userId) {
        const task = await this.findOneByUser(id, userId);
        await this.taskRepository.remove(task);
        return {
            message: 'Task deleted successfully',
        };
    }
    async save(task) {
        return this.taskRepository.save(task);
    }
};
TasksService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Task)),
    __metadata("design:paramtypes", [Repository])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.spec.js.map