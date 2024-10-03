import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}
  async register(data) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const newUser = this.userClient.send(
        { cmd: 'users-create' },
        { email: data.email, password: hashedPassword },
      );
      return newUser;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(email: string, password: string) {
    const foundUser = await firstValueFrom(
      this.userClient.send({ cmd: 'users-find' }, email),
    );

    const isMatch: boolean = await bcrypt.compare(password, foundUser.password);
    if (foundUser && isMatch) {
      return {
        userId: foundUser._id,
        email: foundUser.email,
      };
    }
    return isMatch;
  }

  async login(user) {
    const payload = { email: user.email, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
