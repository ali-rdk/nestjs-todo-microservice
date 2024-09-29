import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { logInDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth-register' })
  register(data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'auth-login' })
  async login(data: logInDto) {
    const user = await this.authService.validateUser(data.email, data.password);

    if (!user) {
      return new UnauthorizedException();
    }

    return this.authService.login(user);
  }
}
