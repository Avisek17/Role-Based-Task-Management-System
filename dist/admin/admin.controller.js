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
import { Controller, Get, Req, Res, } from '@nestjs/common';
import { AdminService } from './admin.service.js';
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async dashboard(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        if (req.session.role !== 'admin') {
            return res.status(403).render('error', {
                message: 'Access denied. Admins only.',
            });
        }
        try {
            const { users, tasks } = await this.adminService.getDashboardData();
            return res.render('admin/dashboard', {
                username: req.session.username,
                role: req.session.role,
                users,
                tasks,
            });
        }
        catch (error) {
            console.error('Admin dashboard error:', error);
            return res.status(500).render('error', {
                message: 'Unable to load admin dashboard',
            });
        }
    }
};
__decorate([
    Get(),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "dashboard", null);
AdminController = __decorate([
    Controller('admin'),
    __metadata("design:paramtypes", [AdminService])
], AdminController);
export { AdminController };
//# sourceMappingURL=admin.controller.js.map