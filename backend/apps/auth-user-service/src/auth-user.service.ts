import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import { RegisterDto, LoginDto } from '../../../libs/common/src/dto/auth.dto';

@Injectable()
export class AuthUserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('อีเมลนี้ถูกใช้งานในระบบเรียบร้อยแล้ว');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        department: dto.department,
        role: dto.role || 'staff',
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    const { password, ...result } = user;
    return { token, user: result };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    const { password, ...result } = user;
    return { token, user: result };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, department: true, role: true, avatar: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน');
    }
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, department: true, role: true, avatar: true },
      orderBy: { name: 'asc' },
    });
  }
}
