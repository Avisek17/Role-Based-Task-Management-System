import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/updata-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll() {
    return this.taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.taskRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  async findOneByUser(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
    });

    return this.taskRepository.save(task);
  }

  async createForUser(
    createTaskDto: CreateTaskDto,
    userId: number,
  ) {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      userId,
      completed: false,
    });

    return this.taskRepository.save(task);
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    return this.taskRepository.save(task);
  }

  async updateForUser(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ) {
    const task = await this.findOneByUser(id, userId);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    return this.taskRepository.save(task);
  }

  async toggleComplete(id: number, userId: number) {
    const task = await this.findOneByUser(id, userId);

    task.completed = !task.completed;

    return this.taskRepository.save(task);
  }

  async delete(id: number) {
    const task = await this.findOne(id);

    await this.taskRepository.remove(task);

    return {
      message: 'Task deleted successfully',
    };
  }

  async deleteForUser(id: number, userId: number) {
    const task = await this.findOneByUser(id, userId);

    await this.taskRepository.remove(task);

    return {
      message: 'Task deleted successfully',
    };
  }

  async save(task: Task) {
    return this.taskRepository.save(task);
  }
}
