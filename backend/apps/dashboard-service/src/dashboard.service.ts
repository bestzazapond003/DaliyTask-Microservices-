import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { RedisService } from '../../../libs/redis/src/redis.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getStats(startDate?: string, endDate?: string, userId?: string) {
    const cacheKey = `dashboard:stats:${userId || 'all'}:${startDate || 'none'}:${endDate || 'none'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (userId && userId !== 'all') where.userId = userId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const totalTasks = await this.prisma.task.count({ where });
    const completedTasks = await this.prisma.task.count({ where: { ...where, status: 'completed' } });
    const inProgressTasks = await this.prisma.task.count({ where: { ...where, status: 'in_progress' } });
    const pendingTasks = await this.prisma.task.count({ where: { ...where, status: 'pending' } });

    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = await this.prisma.task.count({
      where: {
        ...where,
        status: { in: ['pending', 'in_progress'] },
        date: { lt: today },
      },
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const result = { totalTasks, completedTasks, inProgressTasks, pendingTasks, overdueTasks, completionRate };

    // Cache for 60 seconds
    await this.redis.set(cacheKey, result, 60);
    return result;
  }

  async getWorkload(startDate?: string, endDate?: string) {
    const cacheKey = `dashboard:workload:${startDate || 'none'}:${endDate || 'none'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const users = await this.prisma.user.findMany({ select: { id: true, name: true } });
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    const workloadList = await Promise.all(
      users.map(async (user) => {
        const where: any = { userId: user.id };
        if (startDate || endDate) where.date = dateFilter;

        const totalTasks = await this.prisma.task.count({ where });
        const completedTasks = await this.prisma.task.count({ where: { ...where, status: 'completed' } });
        const inProgressTasks = await this.prisma.task.count({ where: { ...where, status: 'in_progress' } });
        const pendingTasks = await this.prisma.task.count({ where: { ...where, status: 'pending' } });
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return { userId: user.id, userName: user.name, totalTasks, completedTasks, inProgressTasks, pendingTasks, completionRate };
      }),
    );

    // Cache for 60 seconds
    await this.redis.set(cacheKey, workloadList, 60);
    return workloadList;
  }

  async getTrends(startDate?: string, endDate?: string) {
    const cacheKey = `dashboard:trends:${startDate || 'none'}:${endDate || 'none'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      select: { date: true, status: true },
      orderBy: { date: 'asc' },
    });

    const trendMap: { [date: string]: { date: string; completed: number; total: number } } = {};
    tasks.forEach((task) => {
      if (!trendMap[task.date]) {
        trendMap[task.date] = { date: task.date, completed: 0, total: 0 };
      }
      trendMap[task.date].total += 1;
      if (task.status === 'completed') trendMap[task.date].completed += 1;
    });

    const result = Object.values(trendMap);

    // Cache for 60 seconds
    await this.redis.set(cacheKey, result, 60);
    return result;
  }
}
