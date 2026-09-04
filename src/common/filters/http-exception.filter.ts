
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import type {
  Request,
  Response,
} from 'express';

import { MulterError } from 'multer';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter {

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    let status =
      HttpStatus.INTERNAL_SERVER_ERROR;

    let message:
      | string
      | string[] =
      'Internal server error';


    // ============================================
    // NESTJS HTTP EXCEPTION
    // ============================================

    if (
      exception instanceof HttpException
    ) {
      status =
        exception.getStatus();

      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse ===
        'string'
      ) {
        message =
          exceptionResponse;

      } else if (
        typeof exceptionResponse ===
          'object' &&
        exceptionResponse !== null
      ) {
        const data =
          exceptionResponse as {
            message?:
              | string
              | string[];
          };

        message =
          data.message ??
          'Request failed';
      }
    }


    // ============================================
    // MULTER FILE UPLOAD ERROR
    // ============================================

    else if (
      exception instanceof MulterError
    ) {

      status =
        HttpStatus.BAD_REQUEST;

      if (
        exception.code ===
        'LIMIT_FILE_SIZE'
      ) {
        status =
          HttpStatus.PAYLOAD_TOO_LARGE;

        message =
          'File size must not exceed 5 MB.';

      } else {
        message =
          exception.message;
      }
    }


    // ============================================
    // NORMAL ERROR
    // ============================================

    else if (
      exception instanceof Error
    ) {
      status =
        HttpStatus.BAD_REQUEST;

      message =
        exception.message;
    }


    // ============================================
    // EJS WEB ROUTES
    // ============================================

    if (
      request.path.startsWith('/tasks')
    ) {

      return response
        .status(status)
        .render(
          'error',
          {
            message,
          },
        );
    }


    // ============================================
    // REST API / JSON RESPONSE
    // ============================================

    return response
      .status(status)
      .json({
        statusCode:
          status,

        message,

        path:
          request.url,

        timestamp:
          new Date().toISOString(),
      });
  }
}
