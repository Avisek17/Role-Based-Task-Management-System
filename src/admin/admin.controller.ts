import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { AdminService } from './admin.service.js';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get()
  async dashboard(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    if (req.session.role !== 'admin') {
      return res.status(403).render('error', {
        message: 'Access denied. Admins only.',
      });
    }

    try {
      const { users, tasks } =
        await this.adminService.getDashboardData();

      return res.render('admin/dashboard', {
        username: req.session.username,
        role: req.session.role,
        users,
        tasks,
      });
    } catch (error) {
      console.error(
        'Admin dashboard error:',
        error,
      );

      return res.status(500).render('error', {
        message: 'Unable to load admin dashboard',
      });
    }
  }
}