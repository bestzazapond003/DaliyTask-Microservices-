import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'somchai@company.com',
    description: 'อีเมลสำหรับเข้าสู่ระบบ',
  })
  @IsEmail({}, { message: 'กรุณากรอกอีเมลให้ถูกต้อง' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  password: string;

  @ApiProperty({
    example: 'สมชาย ใจดี',
    description: 'ชื่อ-นามสกุล',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ-นามสกุล' })
  name: string;

  @ApiProperty({
    example: 'Engineering',
    description: 'แผนก/ฝ่ายงาน',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุแผนก' })
  department: string;

  @ApiPropertyOptional({
    example: 'staff',
    description: 'บทบาทผู้ใช้งาน (admin, manager, staff)',
    default: 'staff',
  })
  @IsString()
  @IsOptional()
  role?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'somchai@company.com',
    description: 'อีเมลสำหรับเข้าสู่ระบบ',
  })
  @IsEmail({}, { message: 'กรุณากรอกอีเมลให้ถูกต้อง' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'รหัสผ่าน',
  })
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  password: string;
}
