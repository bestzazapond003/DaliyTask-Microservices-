import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';
import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt-auth.guard';
import { JwtStrategy } from '../../../libs/common/src/guards/jwt.strategy';
import { TransformInterceptor } from '../../../libs/common/src/interceptors/transform.interceptor';
import { ApiGatewayController } from './api-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'TASK_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'DASHBOARD_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class ApiGatewayModule {}
