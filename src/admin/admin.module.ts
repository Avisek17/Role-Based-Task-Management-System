import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../auth/user.entity.js';
import { Task } from '../tasks/entities/task.entity.js';

import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Task,
    ]),
  ],
  controllers: [
    AdminController,
  ],
  providers: [
    AdminService,
  ],
})
export class AdminModule {}