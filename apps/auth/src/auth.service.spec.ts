import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let userClient: ClientProxy;
  let jwtService: JwtService;

  const mockUserClient = {
    send: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userClient = module.get<ClientProxy>('USER_SERVICE');
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: 'test@test.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockUserClient.send.mockReturnValue(of({}));

      const result = await service.register(registerData);

      expect(result).toEqual({
        message: 'user created',
        status: HttpStatus.CREATED,
      });
    });

    it('should handle errors during registration', async () => {
      const registerData = {
        email: 'test@test.com',
        password: 'password123',
      };

      jest
        .spyOn(bcrypt, 'genSalt')
        .mockRejectedValue(new Error('failed') as never);

      const result = await service.register(registerData);

      expect(result).toBeInstanceOf(HttpException);
    });
  });

  describe('validateUser', () => {
    it('should return false if user is not found', async () => {
      mockUserClient.send.mockReturnValue(of(null));

      const result = await service.validateUser('test@test.com', 'password123');

      expect(result).toBeFalsy();
    });

    it('should return user data if credentials are valid', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      mockUserClient.send.mockReturnValue(of(mockUser));
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('test@test.com', 'password123');

      expect(result).toEqual({
        id: mockUser._id,
        email: mockUser.email,
      });
    });

    it('should return false if password does not match', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      mockUserClient.send.mockReturnValue(of(mockUser));
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(
        'test@test.com',
        'wrongpassword',
      );

      expect(result).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should return JWT token for valid user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@test.com',
      };

      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
