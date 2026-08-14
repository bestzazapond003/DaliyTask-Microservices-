import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';
import { RedisModule } from '../../../libs/redis/src/redis.module';
import { DashboardService } from './dashboard.service';
import { DashboardMicroserviceController } from './dashboard.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
  ],
  controllers: [DashboardMicroserviceController],
  providers: [DashboardService],
})
export class DashboardMicroserviceModule {}
