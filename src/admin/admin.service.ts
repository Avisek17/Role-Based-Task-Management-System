import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../auth/user.entity.js';
import { Task } from '../tasks/entities/task.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

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
}