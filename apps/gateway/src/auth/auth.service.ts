import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  register(data) {
    return this.authClient.send({ cmd: 'auth-register' }, data);
  }

  login(data) {
    return this.authClient.send({ cmd: 'auth-login' }, data);
  }
}
