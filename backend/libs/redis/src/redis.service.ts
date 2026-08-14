import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = parseInt(this.configService.get<string>('REDIS_PORT') || '6379', 10);

    this.client = new Redis({
      host,
      port,
      retryStrategy: (times) => Math.min(times * 100, 3000),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.client.connect().then(() => {
      this.logger.log(`✅ Redis Cache Client connected to ${host}:${port}`);
    }).catch((err) => {
      this.logger.warn(`⚠️ Redis Cache connection warning: ${err.message}`);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.warn(`Redis get failed for key ${key}: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      this.logger.warn(`Redis set failed for key ${key}: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.warn(`Redis del failed for key ${key}: ${error.message}`);
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys && keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.warn(`Redis delByPattern failed for pattern ${pattern}: ${error.message}`);
    }
  }
}
