import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';

import { User } from './user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      throw new Error('Username already exists');
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
}