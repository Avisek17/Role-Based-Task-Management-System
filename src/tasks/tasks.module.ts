import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './entities/task.entity.js';
import { TasksController } from './tasks.controller.js';
import { TasksWebController } from './tasks-web.controller.js';
import { TasksService } from './tasks.service.js';
import { TaskAttachment } from './entities/task-attachment.entity.js';
import { RedisModule } from '../redis/redis.module.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskAttachment]),
    RedisModule
  ],

  controllers: [
    TasksController,
    TasksWebController,
  ],

  providers: [
    TasksService,
  ],
})
export class TasksModule {}