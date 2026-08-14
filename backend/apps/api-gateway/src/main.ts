import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api/v1');

    app.enableCors({
    origin: true, // Allow all origins (localhost:5173, localhost:8080, localhost, etc.)
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-User-Id', 'X-Requested-With'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DailyTask Microservices API Gateway')
    .setDescription('HTTP API Gateway proxying to Auth, Task, and Dashboard Redis Microservices')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 [API Gateway] Server is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
