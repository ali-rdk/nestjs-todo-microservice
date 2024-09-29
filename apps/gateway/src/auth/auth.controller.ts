import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}
  @Post('register')
  register(@Body(ValidationPipe) data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body(ValidationPipe) data: CreateUserDto) {
    return this.authService.login(data);
  }
}
