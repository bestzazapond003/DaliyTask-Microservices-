import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'พัฒนาหน้าจอ Dashboard ประจำสัปดาห์',
    description: 'หัวข้องานประจำวัน',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกหัวข้องาน' })
  title: string;

  @ApiPropertyOptional({
    example: 'สร้างกราฟสถิติสรุปงานและเชื่อมต่อ API กับ Backend',
    description: 'รายละเอียดเพิ่มเติมของงาน',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2026-08-14',
    description: 'วันที่ของงาน (รูปแบบ YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'กรุณาระบุวันที่ให้ถูกต้อง (YYYY-MM-DD)' })
  date: string;

  @ApiPropertyOptional({
    example: 'general',
    description: 'หมวดหมู่งาน (general, urgent, meeting, doc, project, other)',
    default: 'general',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    example: 'medium',
    description: 'ระดับความสำคัญ (low, medium, high)',
    default: 'medium',
  })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({
    example: 'pending',
    description: 'สถานะเริ่มต้นของงาน (pending, in_progress, completed)',
    default: 'pending',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    example: 'user-uuid-1234',
    description: 'ID ผู้รับผิดชอบงาน (หากไม่ระบุจะกำหนดให้ผู้สร้างงานอัตโนมัติ)',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'พัฒนาหน้าจอ Dashboard (อัปเดต Requirement เพิ่มเติม)',
    description: 'หัวข้องานที่ต้องการแก้ไข',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'เพิ่มการแสดงผล Pie Chart และสถิติแนวโน้ม',
    description: 'รายละเอียดงานที่ต้องการแก้ไข',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '2026-08-14',
    description: 'วันที่ของงาน',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    example: 'project',
    description: 'หมวดหมู่งาน',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    example: 'high',
    description: 'ระดับความสำคัญ',
  })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({
    example: 'in_progress',
    description: 'สถานะของงาน',
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateStatusDto {
  @ApiProperty({
    example: 'completed',
    description: 'สถานะงานใหม่ (pending, in_progress, completed)',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุสถานะงาน' })
  status: string;
}

export class QueryTaskDto {
  @ApiPropertyOptional({
    example: '2026-08-01',
    description: 'วันที่เริ่มต้นสำหรับกรองข้อมูล (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-08-31',
    description: 'วันที่สิ้นสุดสำหรับกรองข้อมูล (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: 'all',
    description: 'ID ของผู้ใช้ที่ต้องการดูงาน หรือ "all" เพื่อดูงานของทั้งทีม',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
