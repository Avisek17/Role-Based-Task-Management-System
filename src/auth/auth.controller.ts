import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  /*
   * ============================
   * REGISTER PAGE
   * ============================
   */

  @Get('register')
  registerPage(@Res() res: Response) {
    return res.render('auth/register');
  }

  /*
   * ============================
   * REGISTER USER
   * ============================
   */

  @Post('register')
  async register(
    @Body() body: {
      username: string;
      password: string;
    },
    @Res() res: Response,
  ) {
    try {
      await this.authService.register(
        body.username,
        body.password,
      );

      return res.redirect('/auth/login');
    } catch (error) {
      console.error(
        'Registration error:',
        error,
      );

      return res.status(500).render('error', {
        message:
          error instanceof Error
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

  @Get('login')
  loginPage(@Res() res: Response) {
    return res.render('auth/login');
  }

  /*
   * ============================
   * LOGIN USER
   * ============================
   */

  @Post('login')
  async login(
    @Body() body: {
      username: string;
      password: string;
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user =
      await this.authService.validateUser(
        body.username,
        body.password,
      );

    if (!user) {
      return res.status(401).render('error', {
        message:
          'Invalid username or password',
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

  @Post('logout')
  logout(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.session.destroy((error) => {
      if (error) {
        console.error(
          'Logout error:',
          error,
        );

        return res
          .status(500)
          .send('Unable to logout');
      }

      return res.redirect('/auth/login');
    });
  }
}