import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthUserService } from './auth-user.service';
import { RegisterDto, LoginDto } from '../../../libs/common/src/dto/auth.dto';
import { AllRpcExceptionsFilter } from '../../../libs/common/src/filters/all-rpc-exceptions.filter';

@Controller()
@UseFilters(new AllRpcExceptionsFilter())
export class AuthUserMicroserviceController {
  constructor(private readonly authUserService: AuthUserService) {}

  @MessagePattern('auth.register')
  async register(@Payload() dto: RegisterDto) {
    return this.authUserService.register(dto);
  }

  @MessagePattern('auth.login')
  async login(@Payload() dto: LoginDto) {
    return this.authUserService.login(dto);
  }

  @MessagePattern('user.get_me')
  async getMe(@Payload() userId: string) {
    return this.authUserService.getMe(userId);
  }

  @MessagePattern('user.get_all')
  async getAllUsers() {
    return this.authUserService.getAllUsers();
  }
}
