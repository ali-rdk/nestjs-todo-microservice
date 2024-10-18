import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.cwd() + '\\.env',
        }),
        ClientsModule.register([
          {
            name: 'USER_SERVICE',
            transport: Transport.TCP,
            options: { port: 3001, host: 'localhost' },
          },
        ]),
        JwtModule.registerAsync({
          imports: [ClientsModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return the access token', async () => {
      const res = await authController.login({
        email: 'e@v.com',
        password: '123466789',
      });

      expect(res).toBe({
        response: {
          message: 'Unauthorized',
          statusCode: 401,
        },
        status: 401,
        options: {},
        message: 'Unauthorized',
        name: 'UnauthorizedException',
      });
    });
  });
});
