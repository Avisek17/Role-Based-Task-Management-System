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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity.js';
import { Task } from '../tasks/entities/task.entity.js';
let AdminService = class AdminService {
    userRepository;
    taskRepository;
    constructor(userRepository, taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }
    async getDashboardData() {
        const users = await this.userRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
        const tasks = await this.taskRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
        return {
            users,
            tasks,
        };
    }
};
AdminService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __param(1, InjectRepository(Task)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], AdminService);
export { AdminService };
//# sourceMappingURL=admin.service.js.map