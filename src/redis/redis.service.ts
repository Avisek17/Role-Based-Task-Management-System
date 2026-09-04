import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';

import {Redis} from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  // =====================================================
  // GET VALUE
  // =====================================================

  async get(
    key: string,
  ): Promise<string | null> {
    return await this.redis.get(key);
  }

  // =====================================================
  // SET VALUE
  // =====================================================

  async set(
    key: string,
    value: string,
    expirationSeconds?: number,
  ): Promise<void> {
    if (expirationSeconds) {
      await this.redis.set(
        key,
        value,
        'EX',
        expirationSeconds,
      );
    } else {
      await this.redis.set(
        key,
        value,
      );
    }
  }

  // =====================================================
  // DELETE SINGLE KEY
  // =====================================================

  async delete(
    key: string,
  ): Promise<void> {
    await this.redis.del(key);
  }

  // =====================================================
  // DELETE KEYS BY PATTERN
  // =====================================================

  async deleteByPattern(
    pattern: string,
  ): Promise<void> {
    const keys =
      await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // =====================================================
  // REDIS PING
  // =====================================================

  async ping(): Promise<string> {
    return await this.redis.ping();
  }

  // =====================================================
  // CLOSE REDIS CONNECTION
  // =====================================================

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}