import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

@Controller('admin')
export class AdminController {

  @Get()
  dashboard(
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

    return res.render('admin/dashboard', {
      username: req.session.username,
      role: req.session.role,
      users: [],
      tasks: [],
    });
  }
}