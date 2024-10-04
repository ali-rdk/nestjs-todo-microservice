import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_CONTRACTS } from 'libs/contracts/auth.contracts';
import { IUser } from 'libs/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  register(data: IUser) {
    return this.authClient.send({ cmd: AUTH_CONTRACTS.REGISTER }, data);
  }

  login(data: IUser) {
    return this.authClient.send({ cmd: AUTH_CONTRACTS.LOGIN }, data);
  }
}
