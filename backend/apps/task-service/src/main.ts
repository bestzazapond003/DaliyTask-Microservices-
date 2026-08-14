import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TaskMicroserviceModule } from './task.module';

async function bootstrap() {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TaskMicroserviceModule, {
    transport: Transport.REDIS,
    options: { host: redisHost, port: redisPort },
  });

  await app.listen();
  console.log(`🚀 [Task Management Microservice] listening via Redis Pub/Sub on ${redisHost}:${redisPort}`);
}
bootstrap();
