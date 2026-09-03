import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/updata-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // =====================================================
  // GET ALL TASKS
  // REST API
  // Search + Filter + Sort + Pagination
  // =====================================================

  async findAll(query: TaskQueryDto = {}) {
    const {
      search,
      completed,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const currentPage = Math.max(Number(page) || 1, 1);

    const currentLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100,
    );

    const queryBuilder =
      this.taskRepository.createQueryBuilder('task');

    // Search
    if (search) {
      queryBuilder.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Filter
    if (completed !== undefined) {
      queryBuilder.andWhere(
        'task.completed = :completed',
        {
          completed: completed === 'true',
        },
      );
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

    const safeOrder =
      order?.toUpperCase() === 'ASC'
        ? 'ASC'
        : 'DESC';

    queryBuilder.orderBy(
      `task.${safeSortBy}`,
      safeOrder,
    );

    // Pagination
    const skip =
      (currentPage - 1) * currentLimit;

    queryBuilder.skip(skip);
    queryBuilder.take(currentLimit);

    const [tasks, total] =
      await queryBuilder.getManyAndCount();

    return {
      data: tasks,
      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(
          total / currentLimit,
        ),
      },
    };
  }

  // =====================================================
  // GET ALL TASKS FOR LOGGED-IN USER
  // EJS
  // =====================================================

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

  // =====================================================
  // GET TASK BY ID
  // REST API
  // =====================================================

  async findOne(id: number) {
    const task =
      await this.taskRepository.findOne({
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

  // =====================================================
  // GET TASK BY ID FOR LOGGED-IN USER
  // EJS
  // =====================================================

  async findOneByUser(
    id: number,
    userId: number,
  ) {
    const task =
      await this.taskRepository.findOne({
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

  // =====================================================
  // CREATE TASK
  // REST API
  // =====================================================

  async create(
    createTaskDto: CreateTaskDto,
  ) {
    const task =
      this.taskRepository.create({
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

  async createForUser(
    createTaskDto: CreateTaskDto,
    userId: number,
  ) {
    const task =
      this.taskRepository.create({
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

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task =
      await this.findOne(id);

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

  async updateForUser(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ) {
    const task =
      await this.findOneByUser(
        id,
        userId,
      );

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

  async toggleComplete(
    id: number,
    userId: number,
  ) {
    const task =
      await this.findOneByUser(
        id,
        userId,
      );

    task.completed = !task.completed;

    return this.taskRepository.save(task);
  }

  // =====================================================
  // DELETE TASK
  // REST API
  // =====================================================

  async delete(id: number) {
    const task =
      await this.findOne(id);

    await this.taskRepository.remove(task);

    return {
      message: 'Task deleted successfully',
    };
  }

  // =====================================================
  // DELETE TASK FOR LOGGED-IN USER
  // EJS
  // =====================================================

  async deleteForUser(
    id: number,
    userId: number,
  ) {
    const task =
      await this.findOneByUser(
        id,
        userId,
      );

    await this.taskRepository.remove(task);

    return {
      message: 'Task deleted successfully',
    };
  }

  // =====================================================
  // SAVE TASK
  // =====================================================

  async save(task: Task) {
    return this.taskRepository.save(task);
  }
}
