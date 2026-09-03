var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Post, Req, Res, } from '@nestjs/common';
import { AuthService } from './auth.service.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /*
     * ============================
     * REGISTER PAGE
     * ============================
     */
    registerPage(res) {
        return res.render('auth/register');
    }
    /*
     * ============================
     * REGISTER USER
     * ============================
     */
    async register(body, res) {
        try {
            await this.authService.register(body.username, body.password);
            return res.redirect('/auth/login');
        }
        catch (error) {
            console.error('Registration error:', error);
            return res.status(500).render('error', {
                message: error instanceof Error
                    ? error.message
                    : 'Registration failed',
            });
        }
    }
    /*
     * ============================
     * LOGIN PAGE
     * ============================
     */
    loginPage(res) {
        return res.render('auth/login');
    }
    /*
     * ============================
     * LOGIN USER
     * ============================
     */
    async login(body, req, res) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            return res.status(401).render('error', {
                message: 'Invalid username or password',
            });
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        return res.redirect('/tasks');
    }
    /*
     * ============================
     * LOGOUT
     * ============================
     */
    logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                console.error('Logout error:', error);
                return res
                    .status(500)
                    .send('Unable to logout');
            }
            return res.redirect('/auth/login');
        });
    }
};
__decorate([
    Get('register'),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerPage", null);
__decorate([
    Post('register'),
    __param(0, Body()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Get('login'),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginPage", null);
__decorate([
    Post('login'),
    __param(0, Body()),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('logout'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map