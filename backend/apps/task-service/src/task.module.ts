import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';
import { RedisModule } from '../../../libs/redis/src/redis.module';
import { TaskService } from './task.service';
import { TaskMicroserviceController } from './task.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
  ],
  controllers: [TaskMicroserviceController],
  providers: [TaskService],
})
export class TaskMicroserviceModule {}
