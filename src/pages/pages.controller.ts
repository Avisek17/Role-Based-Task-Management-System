import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

@Controller()
export class PagesController {
  @Get()
  home(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.session.userId) {
      return res.redirect('/tasks');
    }

    return res.redirect('/auth/login');
  }
}