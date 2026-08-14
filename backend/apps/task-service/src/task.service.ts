import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { RedisService } from '../../../libs/redis/src/redis.service';
import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto, QueryTaskDto } from '../../../libs/common/src/dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  private async invalidateDashboardCache() {
    await this.redis.delByPattern('dashboard:*');
  }

  async getTasks(query: QueryTaskDto, currentUserId: string) {
    const { startDate, endDate, userId } = query;
    const where: any = {};

    if (userId && userId !== 'all') {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, department: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((t) => ({ ...t, userName: t.user?.name || 'ไม่ทราบชื่อ' }));
  }

  async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, department: true, avatar: true } },
      },
    });

    if (!task) throw new NotFoundException('ไม่พบรายการงานที่ระบุ');
    return { ...task, userName: task.user?.name || 'ไม่ทราบชื่อ' };
  }

  async createTask(dto: CreateTaskDto, currentUserId: string) {
    const assignedUserId = dto.userId || currentUserId;
    const user = await this.prisma.user.findUnique({ where: { id: assignedUserId } });
    if (!user) throw new NotFoundException('ไม่พบผู้ใช้งานที่ต้องการมอบหมายงาน');

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: dto.date,
        category: dto.category || 'general',
        priority: dto.priority || 'medium',
        status: dto.status || 'pending',
        userId: assignedUserId,
        completedAt: dto.status === 'completed' ? new Date() : null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, department: true, avatar: true } },
      },
    });

    await this.invalidateDashboardCache();
    return { ...task, userName: task.user?.name || user.name };
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
    await this.getTaskById(id);
    const data: any = { ...dto };
    if (dto.status) {
      data.completedAt = dto.status === 'completed' ? new Date() : null;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true, department: true, avatar: true } },
      },
    });

    await this.invalidateDashboardCache();
    return { ...updatedTask, userName: updatedTask.user?.name || 'ไม่ทราบชื่อ' };
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    await this.getTaskById(id);
    const completedAt = dto.status === 'completed' ? new Date() : null;

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { status: dto.status, completedAt },
      include: {
        user: { select: { id: true, name: true, email: true, department: true, avatar: true } },
      },
    });

    await this.invalidateDashboardCache();
    return { ...updatedTask, userName: updatedTask.user?.name || 'ไม่ทราบชื่อ' };
  }

  async deleteTask(id: string) {
    await this.getTaskById(id);
    await this.prisma.task.delete({ where: { id } });
    await this.invalidateDashboardCache();
    return { id, deleted: true };
  }
}
