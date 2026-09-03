var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './user.entity.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';
import { RolesGuard } from './roles.guard.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([User]),
            PassportModule,
            JwtModule.registerAsync({
                global: true,
                useFactory: () => ({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: '1h',
                    },
                }),
            }),
        ],
        controllers: [
            AuthController,
        ],
        providers: [
            AuthService,
            JwtStrategy,
            RolesGuard,
        ],
        exports: [
            AuthService,
            JwtModule,
            PassportModule,
        ],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map