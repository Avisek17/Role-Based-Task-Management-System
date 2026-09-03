import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const expressApp = app.getHttpAdapter().getInstance();
    /*
     * ============================
     * VIEW ENGINE
     * ============================
     */
    expressApp.set('views', path.join(__dirname, '..', 'views'));
    expressApp.set('view engine', 'ejs');
    /*
     * ============================
     * STATIC FILES
     * ============================
     */
    expressApp.use(express.static(path.join(__dirname, '..', 'public')));
    /*
     * ============================
     * SESSION
     * ============================
     */
    expressApp.use(session({
        secret: process.env.SESSION_SECRET ||
            'development-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
        },
    }));
    /*
     * ============================
     * VALIDATION
     * ============================
     */
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    /*
     * ============================
     * SWAGGER
     * ============================
     */
    const config = new DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('REST API for managing tasks')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    console.log('NestJS server running on http://localhost:3000');
    console.log('Swagger documentation: http://localhost:3000/api');
}
bootstrap();
//# sourceMappingURL=main.js.map