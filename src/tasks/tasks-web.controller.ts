
import {
  ArgumentsHost,
  Body,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import multer from 'multer';

import path from 'path';
import crypto from 'crypto';

import type {
  Request,
  Response,
} from 'express';

import { TasksService } from './tasks.service.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/updata-task.dto.js';


// =====================================================
// FILE VALIDATION CONFIGURATION
// =====================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
];


// =====================================================
// CUSTOM FILE UPLOAD ERROR
// =====================================================

class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}


// =====================================================
// WEB FILE UPLOAD EXCEPTION FILTER
// =====================================================

@Catch(
  multer.MulterError,
  FileUploadError,
)
export class WebFileUploadExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    let statusCode = 400;

    let message =
      'Unable to upload file.';


    // -----------------------------------------------
    // MULTER ERROR
    // -----------------------------------------------

    if (
      exception instanceof multer.MulterError
    ) {

      if (
        exception.code === 'LIMIT_FILE_SIZE'
      ) {
        statusCode = 413;

        message =
          'File too large. Maximum allowed size is 5 MB.';
      } else {
        message =
          'File upload failed.';
      }

    }


    // -----------------------------------------------
    // CUSTOM FILE VALIDATION ERROR
    // -----------------------------------------------

    else if (
      exception instanceof FileUploadError
    ) {

      message =
        exception.message;

    }


    // -----------------------------------------------
    // RENDER EJS ERROR PAGE
    // -----------------------------------------------

    return response
      .status(statusCode)
      .render(
        'error',
        {
          message,
        },
      );
  }
}


// =====================================================
// FILE UPLOAD OPTIONS
// =====================================================

const fileUploadOptions = {

  storage: diskStorage({

    destination:
      './public/uploads/tasks',

    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (
        error: Error | null,
        filename: string,
      ) => void,
    ) => {

      const extension =
        path
          .extname(
            file.originalname,
          )
          .toLowerCase();

      const filename =
        `${crypto.randomUUID()}${extension}`;

      callback(
        null,
        filename,
      );
    },
  }),


  // -----------------------------------------------
  // MAXIMUM FILE SIZE
  // -----------------------------------------------

  limits: {
    fileSize: MAX_FILE_SIZE,
  },


  // -----------------------------------------------
  // FILE TYPE + EXTENSION VALIDATION
  // -----------------------------------------------

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: (
      error: Error | null,
      acceptFile: boolean,
    ) => void,
  ) => {

    const extension =
      path
        .extname(
          file.originalname,
        )
        .toLowerCase();


    // Check MIME type

    if (
      !ALLOWED_MIME_TYPES.includes(
        file.mimetype,
      )
    ) {

      return callback(
        new FileUploadError(
          'Invalid file type. Allowed files: PDF, DOC, DOCX, JPG, JPEG, PNG.',
        ),
        false,
      );
    }


    // Check extension

    if (
      !ALLOWED_EXTENSIONS.includes(
        extension,
      )
    ) {

      return callback(
        new FileUploadError(
          'Invalid file extension.',
        ),
        false,
      );
    }


    callback(
      null,
      true,
    );
  },
};


// =====================================================
// CONTROLLER
// =====================================================

@Controller('tasks')
export class TasksWebController {

  constructor(
    private readonly tasksService: TasksService,
  ) {}


  // =====================================================
  // GET /tasks
  // =====================================================

  @Get()
  async index(
    @Req() req: Request,
    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    try {

      const tasks =
        await this.tasksService.findAllByUser(
          req.session.userId,
        );

      return res.render(
        'tasks/index',
        {
          username:
            req.session.username,

          role:
            req.session.role,

          tasks,
        },
      );

    } catch (error) {

      console.error(
        'Fetch tasks error:',
        error,
      );

      return res
        .status(500)
        .render(
          'error',
          {
            message:
              'Unable to fetch tasks',
          },
        );
    }
  }


  // =====================================================
  // GET /tasks/new
  // =====================================================

  @Get('new')
  createPage(
    @Req() req: Request,
    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    return res.render(
      'tasks/create',
      {
        username:
          req.session.username,

        role:
          req.session.role,
      },
    );
  }


  // =====================================================
  // POST /tasks
  // CREATE TASK + FILE
  // =====================================================

  @Post()
  @UseFilters(
    WebFileUploadExceptionFilter,
  )
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      fileUploadOptions,
    ),
  )
  async create(
    @Req() req: Request,

    @Body()
    body: CreateTaskDto,

    @Res() res: Response,
    @UploadedFile()
    file?: Express.Multer.File,

    
  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    try {

      console.log(
        '========== CREATE TASK ==========',
      );

      console.log(
        'Title:',
        body.title,
      );

      console.log(
        'Description:',
        body.description,
      );

      console.log(
        'User ID:',
        req.session.userId,
      );

      console.log(
        'Uploaded file:',
        file,
      );


      await this.tasksService.createForUser(
        body,
        req.session.userId,
        file,
      );


      return res.redirect(
        '/tasks',
      );

    } catch (error) {

      console.error(
        'Create task error:',
        error,
      );

      return res
        .status(500)
        .render(
          'error',
          {
            message:
              'Unable to create task',
          },
        );
    }
  }


  // =====================================================
  // GET /tasks/:id/edit
  // =====================================================

  @Get(':id/edit')
  async editPage(
    @Param('id') id: string,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    try {

      const task =
        await this.tasksService.findOneByUser(
          Number(id),
          req.session.userId,
        );

      return res.render(
        'tasks/edit',
        {
          username:
            req.session.username,

          role:
            req.session.role,

          task,
        },
      );

    } catch (error) {

      console.error(
        'Fetch task for edit error:',
        error,
      );

      return res
        .status(404)
        .render(
          'error',
          {
            message:
              'Task not found',
          },
        );
    }
  }


  // =====================================================
  // POST /tasks/:id
  // UPDATE TASK + REPLACE FILE
  // =====================================================

  @Post(':id')
  @UseFilters(
    WebFileUploadExceptionFilter,
  )
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      fileUploadOptions,
    ),
  )
  async update(
    @Param('id') id: string,

    @Body()
    body: UpdateTaskDto,

    @Req() req: Request,

    @Res() res: Response,
    @UploadedFile()
    file?: Express.Multer.File,

  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    try {

      console.log(
        '========== UPDATE TASK ==========',
      );

      console.log(
        'Task ID:',
        id,
      );

      console.log(
        'Body:',
        body,
      );

      console.log(
        'Uploaded file:',
        file,
      );


      await this.tasksService.updateForUser(
        Number(id),
        body,
        req.session.userId,
        file,
      );


      return res.redirect(
        '/tasks',
      );

    } catch (error) {

      console.error(
        'Update task error:',
        error,
      );

      return res
        .status(404)
        .render(
          'error',
          {
            message:
              'Task not found',
          },
        );
    }
  }


  // =====================================================
  // POST /tasks/:id/complete
  // =====================================================

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    try {

      await this.tasksService.toggleComplete(
        Number(id),
        req.session.userId,
      );

      return res.redirect(
        '/tasks',
      );

    } catch (error) {

      console.error(
        'Complete task error:',
        error,
      );

      return res
        .status(404)
        .render(
          'error',
          {
            message:
              'Task not found',
          },
        );
    }
  }


  // =====================================================
  // POST /tasks/:id/delete
  // =====================================================

  @Post(':id/delete')
  async delete(
    @Param('id') id: string,

    @Req() req: Request,

    @Res() res: Response,
  ) {

    if (!req.session.userId) {
      return res.redirect(
        '/auth/login',
      );
    }

    try {

      await this.tasksService.deleteForUser(
        Number(id),
        req.session.userId,
      );

      return res.redirect(
        '/tasks',
      );

    } catch (error) {

      console.error(
        'Delete task error:',
        error,
      );

      return res
        .status(404)
        .render(
          'error',
          {
            message:
              'Task not found',
          },
        );
    }
  }
}
