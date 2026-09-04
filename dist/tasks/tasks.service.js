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
import { TaskAttachment } from './entities/task-attachment.entity.js';
import { RedisService } from '../redis/redis.service.js';
import path from 'path';
import * as fs from 'fs/promises';
let TasksService = class TasksService {
    taskRepository;
    attachmentRepository;
    redisService;
    constructor(taskRepository, attachmentRepository, redisService) {
        this.taskRepository = taskRepository;
        this.attachmentRepository = attachmentRepository;
        this.redisService = redisService;
    }
    // =====================================================
    // REDIS CACHE HELPERS
    // =====================================================
    /**
     * Delete all cached task list results.
     *
     * This is called whenever a task is created,
     * updated, completed, or deleted.
     */
    async clearTaskListCache() {
        await this.redisService.deleteByPattern('tasks:*');
    }
    // =====================================================
    // GET ALL TASKS
    // REST API
    // Search + Filter + Sort + Pagination + Redis Cache
    // =====================================================
    async findAll(query = {}) {
        const { search, completed, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10, } = query;
        const currentPage = Math.max(Number(page) || 1, 1);
        const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
        // =================================================
        // SAFE SORT VALUES
        // =================================================
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
        // =================================================
        // CREATE REDIS CACHE KEY
        // =================================================
        const cacheKey = [
            'tasks',
            `search=${search ?? ''}`,
            `completed=${completed ?? ''}`,
            `sortBy=${safeSortBy}`,
            `order=${safeOrder}`,
            `page=${currentPage}`,
            `limit=${currentLimit}`,
        ].join(':');
        // =================================================
        // CHECK REDIS CACHE
        // =================================================
        const cachedTasks = await this.redisService.get(cacheKey);
        if (cachedTasks) {
            console.log(`Redis cache HIT: ${cacheKey}`);
            return JSON.parse(cachedTasks);
        }
        console.log(`Redis cache MISS: ${cacheKey}`);
        // =================================================
        // CREATE DATABASE QUERY
        // =================================================
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        // =================================================
        // SEARCH
        // =================================================
        if (search) {
            queryBuilder.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {
                search: `%${search}%`,
            });
        }
        // =================================================
        // FILTER
        // =================================================
        if (completed !== undefined) {
            queryBuilder.andWhere('task.completed = :completed', {
                completed: completed === 'true',
            });
        }
        // =================================================
        // SORT
        // =================================================
        queryBuilder.orderBy(`task.${safeSortBy}`, safeOrder);
        // =================================================
        // PAGINATION
        // =================================================
        const skip = (currentPage - 1) * currentLimit;
        queryBuilder.skip(skip);
        queryBuilder.take(currentLimit);
        // =================================================
        // EXECUTE DATABASE QUERY
        // =================================================
        const [tasks, total] = await queryBuilder.getManyAndCount();
        // =================================================
        // CREATE RESPONSE
        // =================================================
        const result = {
            data: tasks,
            pagination: {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages: Math.ceil(total / currentLimit),
            },
        };
        // =================================================
        // STORE RESULT IN REDIS
        // TTL = 60 SECONDS
        // =================================================
        await this.redisService.set(cacheKey, JSON.stringify(result), 60);
        return result;
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
            relations: {
                attachments: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    // =====================================================
    // GET TASK BY ID
    // REST API + Redis Cache
    // =====================================================
    async findOne(id) {
        const cacheKey = `task:${id}`;
        // =================================================
        // CHECK REDIS
        // =================================================
        const cachedTask = await this.redisService.get(cacheKey);
        if (cachedTask) {
            console.log(`Redis cache HIT: ${cacheKey}`);
            return JSON.parse(cachedTask);
        }
        console.log(`Redis cache MISS: ${cacheKey}`);
        // =================================================
        // GET FROM DATABASE
        // =================================================
        const task = await this.taskRepository.findOne({
            where: {
                id,
            },
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        // =================================================
        // STORE IN REDIS
        // TTL = 60 SECONDS
        // =================================================
        await this.redisService.set(cacheKey, JSON.stringify(task), 60);
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
        const savedTask = await this.taskRepository.save(task);
        // =================================================
        // CLEAR TASK LIST CACHE
        // =================================================
        await this.clearTaskListCache();
        return savedTask;
    }
    // =====================================================
    // CREATE TASK FOR LOGGED-IN USER
    // EJS
    // =====================================================
    async createForUser(createTaskDto, userId, file) {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            userId,
            completed: false,
        });
        const savedTask = await this.taskRepository.save(task);
        // =================================================
        // SAVE ATTACHMENT
        // =================================================
        if (file) {
            const attachment = this.attachmentRepository.create({
                taskId: savedTask.id,
                originalName: file.originalname,
                fileName: file.filename,
                mimeType: file.mimetype,
                size: file.size,
            });
            await this.attachmentRepository.save(attachment);
        }
        return savedTask;
    }
    // =====================================================
    // UPDATE TASK
    // REST API
    // =====================================================
    async update(id, updateTaskDto) {
        const task = await this.findOne(id);
        // =================================================
        // UPDATE TITLE
        // =================================================
        if (updateTaskDto.title !== undefined) {
            task.title =
                updateTaskDto.title;
        }
        // =================================================
        // UPDATE DESCRIPTION
        // =================================================
        if (updateTaskDto.description !== undefined) {
            task.description =
                updateTaskDto.description;
        }
        // =================================================
        // SAVE TO DATABASE
        // =================================================
        const updatedTask = await this.taskRepository.save(task);
        // =================================================
        // INVALIDATE REDIS CACHE
        // =================================================
        await this.redisService.delete(`task:${id}`);
        await this.clearTaskListCache();
        return updatedTask;
    }
    // =====================================================
    // UPDATE TASK FOR LOGGED-IN USER
    // EJS
    // =====================================================
    async updateForUser(id, updateTaskDto, userId, file) {
        const task = await this.findOneByUser(id, userId);
        // =================================================
        // UPDATE TITLE
        // =================================================
        if (updateTaskDto.title !== undefined) {
            task.title =
                updateTaskDto.title;
        }
        // =================================================
        // UPDATE DESCRIPTION
        // =================================================
        if (updateTaskDto.description !== undefined) {
            task.description =
                updateTaskDto.description;
        }
        const savedTask = await this.taskRepository.save(task);
        // =================================================
        // REPLACE ATTACHMENT
        // =================================================
        if (file) {
            const existingAttachment = await this.attachmentRepository.findOne({
                where: {
                    taskId: savedTask.id,
                },
            });
            // =================================================
            // OLD ATTACHMENT EXISTS
            // =================================================
            if (existingAttachment) {
                const oldFilePath = path.join(process.cwd(), 'public', 'uploads', 'tasks', existingAttachment.fileName);
                try {
                    await fs.unlink(oldFilePath);
                    console.log('Old attachment deleted:', oldFilePath);
                }
                catch (error) {
                    console.log('Old physical file could not be deleted:', error);
                }
                // ---------------------------------------------
                // UPDATE DATABASE RECORD
                // ---------------------------------------------
                existingAttachment.originalName =
                    file.originalname;
                existingAttachment.fileName =
                    file.filename;
                existingAttachment.mimeType =
                    file.mimetype;
                existingAttachment.size =
                    file.size;
                await this.attachmentRepository.save(existingAttachment);
                console.log('Attachment replaced successfully');
            }
            // =================================================
            // NO EXISTING ATTACHMENT
            // =================================================
            else {
                const attachment = this.attachmentRepository.create({
                    taskId: savedTask.id,
                    originalName: file.originalname,
                    fileName: file.filename,
                    mimeType: file.mimetype,
                    size: file.size,
                });
                await this.attachmentRepository.save(attachment);
                console.log('New attachment added');
            }
        }
        // =================================================
        // INVALIDATE REST API CACHE
        // =================================================
        await this.redisService.delete(`task:${id}`);
        await this.clearTaskListCache();
        return savedTask;
    }
    // =====================================================
    // TOGGLE COMPLETED
    // EJS
    // =====================================================
    async toggleComplete(id, userId) {
        const task = await this.findOneByUser(id, userId);
        task.completed =
            !task.completed;
        const updatedTask = await this.taskRepository.save(task);
        // =================================================
        // INVALIDATE REDIS CACHE
        // =================================================
        await this.redisService.delete(`task:${id}`);
        await this.clearTaskListCache();
        return updatedTask;
    }
    // =====================================================
    // DELETE TASK
    // REST API
    // =====================================================
    async delete(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
        // =================================================
        // INVALIDATE REDIS CACHE
        // =================================================
        await this.redisService.delete(`task:${id}`);
        await this.clearTaskListCache();
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
        // =================================================
        // INVALIDATE REST API CACHE
        // =================================================
        await this.redisService.delete(`task:${id}`);
        await this.clearTaskListCache();
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
    __param(1, InjectRepository(TaskAttachment)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        RedisService])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.js.map