var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException, HttpStatus, } from '@nestjs/common';
import { MulterError } from 'multer';
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        // ============================================
        // NESTJS HTTP EXCEPTION
        // ============================================
        if (exception instanceof HttpException) {
            status =
                exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse ===
                'string') {
                message =
                    exceptionResponse;
            }
            else if (typeof exceptionResponse ===
                'object' &&
                exceptionResponse !== null) {
                const data = exceptionResponse;
                message =
                    data.message ??
                        'Request failed';
            }
        }
        // ============================================
        // MULTER FILE UPLOAD ERROR
        // ============================================
        else if (exception instanceof MulterError) {
            status =
                HttpStatus.BAD_REQUEST;
            if (exception.code ===
                'LIMIT_FILE_SIZE') {
                status =
                    HttpStatus.PAYLOAD_TOO_LARGE;
                message =
                    'File size must not exceed 5 MB.';
            }
            else {
                message =
                    exception.message;
            }
        }
        // ============================================
        // NORMAL ERROR
        // ============================================
        else if (exception instanceof Error) {
            status =
                HttpStatus.BAD_REQUEST;
            message =
                exception.message;
        }
        // ============================================
        // EJS WEB ROUTES
        // ============================================
        if (request.path.startsWith('/tasks')) {
            return response
                .status(status)
                .render('error', {
                message,
            });
        }
        // ============================================
        // REST API / JSON RESPONSE
        // ============================================
        return response
            .status(status)
            .json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
};
HttpExceptionFilter = __decorate([
    Catch()
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map