var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, } from '@nestjs/common';
import { Redis } from 'ioredis';
let RedisService = class RedisService {
    redis;
    constructor() {
        this.redis = new Redis({
            host: 'localhost',
            port: 6379,
        });
    }
    // =====================================================
    // GET VALUE
    // =====================================================
    async get(key) {
        return await this.redis.get(key);
    }
    // =====================================================
    // SET VALUE
    // =====================================================
    async set(key, value, expirationSeconds) {
        if (expirationSeconds) {
            await this.redis.set(key, value, 'EX', expirationSeconds);
        }
        else {
            await this.redis.set(key, value);
        }
    }
    // =====================================================
    // DELETE SINGLE KEY
    // =====================================================
    async delete(key) {
        await this.redis.del(key);
    }
    // =====================================================
    // DELETE KEYS BY PATTERN
    // =====================================================
    async deleteByPattern(pattern) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }
    // =====================================================
    // REDIS PING
    // =====================================================
    async ping() {
        return await this.redis.ping();
    }
    // =====================================================
    // CLOSE REDIS CONNECTION
    // =====================================================
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
RedisService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], RedisService);
export { RedisService };
//# sourceMappingURL=redis.service.js.map