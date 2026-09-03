import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { TasksService } from './tasks.service.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/updata-task.dto.js';


@Controller('tasks')
export class TasksWebController {

  constructor(
    private readonly tasksService: TasksService,
  ) {}


  /*
    ============================
    GET /tasks
    ============================
  */

  @Get()
  async index(
    @Req() req: Request,
    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    try {

      const tasks =
        await this.tasksService.findAllByUser(
          req.session.userId,
        );

      return res.render('tasks/index', {
        username: req.session.username,
        role: req.session.role,
        tasks,
      });

    } catch (error) {

      console.error('Fetch tasks error:', error);

      return res.status(500).render('error', {
        message: 'Unable to fetch tasks',
      });
    }
  }


  /*
    ============================
    GET /tasks/new
    ============================
  */

  @Get('new')
  createPage(
    @Req() req: Request,
    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    return res.render('tasks/create', {
      username: req.session.username,
      role: req.session.role,
    });
  }


  /*
    ============================
    POST /tasks
    ============================
  */

  @Post()
  async create(
    @Req() req: Request,

    @Body()
    body: CreateTaskDto,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    try {

      console.log('Creating task:', {
        title: body.title,
        description: body.description,
        userId: req.session.userId,
      });

      await this.tasksService.createForUser(
        body,
        req.session.userId,
      );

      return res.redirect('/tasks');

    } catch (error) {

      console.error('Create task error:', error);

      return res.status(500).render('error', {
        message: 'Unable to create task',
      });
    }
  }


  /*
    ============================
    GET /tasks/:id/edit
    ============================
  */

  @Get(':id/edit')
  async editPage(
    @Param('id') id: string,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    try {

      const task =
        await this.tasksService.findOneByUser(
          Number(id),
          req.session.userId,
        );

      return res.render('tasks/edit', {
        username: req.session.username,
        role: req.session.role,
        task,
      });

    } catch (error) {

      console.error('Fetch task for edit error:', error);

      return res.status(404).render('error', {
        message: 'Task not found',
      });
    }
  }


  /*
    ============================
    POST /tasks/:id
    ============================
  */

  @Post(':id')
  async update(
    @Param('id') id: string,

    @Body()
    body: UpdateTaskDto,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    try {

      await this.tasksService.updateForUser(
        Number(id),
        body,
        req.session.userId,
      );

      return res.redirect('/tasks');

    } catch (error) {

      console.error('Update task error:', error);

      return res.status(404).render('error', {
        message: 'Task not found',
      });
    }
  }


  /*
    ============================
    POST /tasks/:id/complete
    ============================
  */

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    try {

      await this.tasksService.toggleComplete(
        Number(id),
        req.session.userId,
      );

      return res.redirect('/tasks');

    } catch (error) {

      console.error('Complete task error:', error);

      return res.status(404).render('error', {
        message: 'Task not found',
      });
    }
  }


  /*
    ============================
    POST /tasks/:id/delete
    ============================
  */

  @Post(':id/delete')
  async delete(
    @Param('id') id: string,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    try {

      await this.tasksService.deleteForUser(
        Number(id),
        req.session.userId,
      );

      return res.redirect('/tasks');

    } catch (error) {

      console.error('Delete task error:', error);

      return res.status(404).render('error', {
        message: 'Task not found',
      });
    }
  }
}
