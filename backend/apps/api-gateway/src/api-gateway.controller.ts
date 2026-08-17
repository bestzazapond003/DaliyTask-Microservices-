import { firstValueFrom } from 'rxjs';
import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventsGateway } from './events.gateway';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from '../../../libs/common/src/decorators/public.decorator';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { RegisterDto, LoginDto } from '../../../libs/common/src/dto/auth.dto';
import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto, QueryTaskDto } from '../../../libs/common/src/dto/task.dto';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('TASK_SERVICE') private readonly taskClient: ClientProxy,
    @Inject('DASHBOARD_SERVICE') private readonly dashboardClient: ClientProxy,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // ==========================================
  // 🔐 1. AUTHENTICATION & USERS
  // ==========================================
  @ApiTags('Authentication')
  @Public()
  @Post('auth/register')
  @ApiOperation({ summary: 'สมัครสมาชิกผู้ใช้งานใหม่' })
  @ApiResponse({ status: 201, description: 'สมัครสมาชิกสำเร็จ พร้อมคืนค่า JWT Token และข้อมูลผู้ใช้' })
  @ApiResponse({ status: 400, description: 'อีเมลนี้มีอยู่ในระบบแล้ว หรือข้อมูลไม่ถูกต้อง' })
  register(@Body() dto: RegisterDto) {
    return this.authClient.send('auth.register', dto);
  }

  @ApiTags('Authentication')
  @Public()
  @Post('auth/login')
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน' })
  @ApiResponse({ status: 200, description: 'เข้าสู่ระบบสำเร็จ พร้อมคืนค่า JWT Token' })
  @ApiResponse({ status: 401, description: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  login(@Body() dto: LoginDto) {
    return this.authClient.send('auth.login', dto);
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @Get('users/me')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบันที่ล็อกอิน' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลโปรไฟล์สำเร็จ' })
  @ApiResponse({ status: 401, description: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  getMe(@CurrentUser('id') userId: string) {
    return this.authClient.send('user.get_me', userId);
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @Get('users')
  @ApiOperation({ summary: 'ดึงรายชื่อสมาชิกในทีมทั้งหมด (สำหรับ Filter หรือมอบหมายงาน)' })
  @ApiResponse({ status: 200, description: 'ดึงรายชื่อผู้ใช้ทั้งหมดสำเร็จ' })
  getAllUsers() {
    return this.authClient.send('user.get_all', {});
  }

  // ==========================================
  // 📝 2. TASK MANAGEMENT
  // ==========================================
  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Get('tasks')
  @ApiOperation({ summary: 'ดึงรายการงานทั้งหมดตามช่วงวันที่และผู้ใช้' })
  @ApiResponse({ status: 200, description: 'ดึงรายการงานสำเร็จ' })
  getTasks(@Query() query: QueryTaskDto, @CurrentUser('id') userId: string) {
    return this.taskClient.send('task.get_list', { query, userId });
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Get('tasks/:id')
  @ApiOperation({ summary: 'ดึงรายละเอียดของงานตาม Task ID' })
  @ApiParam({ name: 'id', description: 'ID ของงาน (UUID)', example: 'task-uuid-1234' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลงานสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบรายการงานที่ระบุ' })
  getTaskById(@Param('id') id: string) {
    return this.taskClient.send('task.get_by_id', id);
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Post('tasks')
  @ApiOperation({ summary: 'สร้างรายการงานใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างงานสำเร็จ' })
  createTask(@Body() dto: CreateTaskDto, @CurrentUser('id') userId: string) {
    return this.taskClient.send('task.create', { dto, userId });
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Put('tasks/:id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลงานทั้งหมดตาม Task ID' })
  @ApiParam({ name: 'id', description: 'ID ของงานที่ต้องการแก้ไข' })
  @ApiResponse({ status: 200, description: 'แก้ไขข้อมูลงานสำเร็จ' })
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskClient.send('task.update', { id, dto });
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Patch('tasks/:id/status')
  @ApiOperation({ summary: 'เปลี่ยนสถานะของงานอย่างรวดเร็ว (Quick Status Toggle)' })
  @ApiParam({ name: 'id', description: 'ID ของงานที่ต้องการเปลี่ยนสถานะ' })
  @ApiResponse({ status: 200, description: 'อัปเดตสถานะงานสำเร็จ' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.taskClient.send('task.update_status', { id, dto });
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Delete('tasks/:id')
  @ApiOperation({ summary: 'ลบรายการงานตาม Task ID' })
  @ApiParam({ name: 'id', description: 'ID ของงานที่ต้องการลบ' })
  @ApiResponse({ status: 200, description: 'ลบงานสำเร็จ' })
  deleteTask(@Param('id') id: string) {
    return this.taskClient.send('task.delete', id);
  }

  // ==========================================
  // 📊 3. DASHBOARD & ANALYTICS
  // ==========================================
  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'ดึงข้อมูลสถิติภาพรวม (งานทั้งหมด, งานที่เสร็จ, งานค้าง, Overdue, % สำเร็จ)' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-08-01', description: 'วันที่เริ่มต้น' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-08-31', description: 'วันที่สิ้นสุด' })
  @ApiQuery({ name: 'userId', required: false, example: 'all', description: 'ID ผู้ใช้ หรือ "all"' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสถิติภาพรวมสำเร็จ' })
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
  ) {
    return this.dashboardClient.send('dashboard.get_stats', { startDate, endDate, userId });
  }

  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @Get('dashboard/workload')
  @ApiOperation({ summary: 'ดึงข้อมูลภาระงานเปรียบเทียบของสมาชิกแต่ละคนในทีม (Team Workload)' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-08-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-08-31' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลภาระงานทีมสำเร็จ' })
  getWorkload(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardClient.send('dashboard.get_workload', { startDate, endDate });
  }

  @ApiTags('Dashboard')
  @ApiBearerAuth()
  @Get('dashboard/trends')
  @ApiOperation({ summary: 'ดึงข้อมูลแนวโน้มงานรายวันสำหรับพล็อตกราฟ (Daily Task Trends)' })
  @ApiQuery({ name: 'startDate', required: false, example: '2026-08-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2026-08-31' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลแนวโน้มกราฟสำเร็จ' })
  getTrends(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardClient.send('dashboard.get_trends', { startDate, endDate });
  }
}
