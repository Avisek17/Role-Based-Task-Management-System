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
    // =====================================================
    // GET ALL TASKS
    // REST API
    // Search + Filter + Sort + Pagination
    // =====================================================
    async findAll(query = {}) {
        const { search, completed, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10, } = query;
        const currentPage = Math.max(Number(page) || 1, 1);
        const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        // Search
        if (search) {
            queryBuilder.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {
                search: `%${search}%`,
            });
        }
        // Filter
        if (completed !== undefined) {
            queryBuilder.andWhere('task.completed = :completed', {
                completed: completed === 'true',
            });
        }
        // Sort
        const allowedSortFields = [
            'id',
            'title',
            'createdAt',
            'updatedAt',
        ];
        const safeSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : 'createdAt';
        const safeOrder = order?.toUpperCase() === 'ASC'
            ? 'ASC'
            : 'DESC';
        queryBuilder.orderBy(`task.${safeSortBy}`, safeOrder);
        // Pagination
        const skip = (currentPage - 1) * currentLimit;
        queryBuilder.skip(skip);
        queryBuilder.take(currentLimit);
        const [tasks, total] = await queryBuilder.getManyAndCount();
        return {
            data: tasks,
            pagination: {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages: Math.ceil(total / currentLimit),
            },
        };
    }
    // =====================================================
    // GET ALL TASKS FOR LOGGED-IN USER
    // EJS
    // =====================================================
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
    // =====================================================
    // GET TASK BY ID
    // REST API
    // =====================================================
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
    // =====================================================
    // GET TASK BY ID FOR LOGGED-IN USER
    // EJS
    // =====================================================
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
    // =====================================================
    // CREATE TASK
    // REST API
    // =====================================================
    async create(createTaskDto) {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            completed: false,
        });
        return this.taskRepository.save(task);
    }
    // =====================================================
    // CREATE TASK FOR LOGGED-IN USER
    // EJS
    // =====================================================
    async createForUser(createTaskDto, userId) {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            userId,
            completed: false,
        });
        return this.taskRepository.save(task);
    }
    // =====================================================
    // UPDATE TASK
    // REST API
    // =====================================================
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
    // =====================================================
    // UPDATE TASK FOR LOGGED-IN USER
    // EJS
    // =====================================================
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
    // =====================================================
    // TOGGLE COMPLETED
    // EJS
    // =====================================================
    async toggleComplete(id, userId) {
        const task = await this.findOneByUser(id, userId);
        task.completed = !task.completed;
        return this.taskRepository.save(task);
    }
    // =====================================================
    // DELETE TASK
    // REST API
    // =====================================================
    async delete(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
        return {
            message: 'Task deleted successfully',
        };
    }
    // =====================================================
    // DELETE TASK FOR LOGGED-IN USER
    // EJS
    // =====================================================
    async deleteForUser(id, userId) {
        const task = await this.findOneByUser(id, userId);
        await this.taskRepository.remove(task);
        return {
            message: 'Task deleted successfully',
        };
    }
    // =====================================================
    // SAVE TASK
    // =====================================================
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
//# sourceMappingURL=tasks.service.js.map