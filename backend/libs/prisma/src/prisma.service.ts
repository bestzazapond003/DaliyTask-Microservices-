import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaMssql(connectionString);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
