import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_CONTRACTS } from 'libs/contracts/users.contracts';
import { IToken } from 'libs/interfaces/token.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IToken) {
    if (!payload.sub) {
      return new UnauthorizedException('Invalid Token');
    }

    const foundUser = await firstValueFrom(
      this.userClient.send({ cmd: USER_CONTRACTS.FIND_BY_ID }, payload.sub),
    );

    if (!foundUser && foundUser.email !== payload.email) {
      return new UnauthorizedException();
    }

    return { userId: payload.sub, email: payload.email };
  }
}
