import {
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { User } from './user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      return null;
    }

    return user;
  }

  async register(
    username: string,
    password: string,
  ): Promise<User> {
    const existingUser =
      await this.userRepository.findOne({
        where: {
          username,
        },
      });

    if (existingUser) {
      throw new Error(
        'Username already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: 'user',
    });

    return this.userRepository.save(user);
  }

  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),
    };
  }
}
