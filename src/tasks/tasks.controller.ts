import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { TasksService } from './tasks.service.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/updata-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  // GET /api/v1/tasks
  // Search + filter + sort + pagination
  @Get()
  findAll(@Query() query: TaskQueryDto) {
    return this.tasksService.findAll(query);
  }

  // GET /api/v1/tasks/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  // POST /api/v1/tasks
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // PATCH /api/v1/tasks/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      Number(id),
      updateTaskDto,
    );
  }

  // DELETE /api/v1/tasks/:id
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(Number(id));
  }
}