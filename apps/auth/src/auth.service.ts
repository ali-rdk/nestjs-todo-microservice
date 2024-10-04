import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { USER_CONTRACTS } from 'libs/contracts/users.contracts';
import { IUser } from 'libs/interfaces/user.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}
  async register(data: IUser) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const newUser = this.userClient.send(
        { cmd: USER_CONTRACTS.CREATE },
        { email: data.email, password: hashedPassword },
      );
      return { message: 'user created', status: HttpStatus.CREATED };
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
      this.userClient.send({ cmd: USER_CONTRACTS.FIND_ONE }, email),
    );

    const isMatch: boolean = await bcrypt.compare(password, foundUser.password);
    if (foundUser && isMatch) {
      return {
        id: foundUser._id,
        email: foundUser.email,
      };
    }
    return isMatch;
  }

  async login(user: IUser) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
