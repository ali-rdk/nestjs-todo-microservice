import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

describe('UserService', () => {
  let userService;
  let mockModel;

  beforeEach(async () => {
    mockModel = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should return InternalServerErrorException if saving process failed', async () => {
      const mockUserDto = { email: 'z@v.com', password: '111111111111111' };

      const mockUser = {
        ...mockUserDto,
        save: jest.fn().mockRejectedValue(new Error('failed')),
      };

      mockModel.mockImplementation(async () => mockUser);

      const result = await userService.create(mockUserDto);

      expect(result).toBeInstanceOf(InternalServerErrorException);
    });

    it('it should create new user of there no saving issue', async () => {
      const mockUserDto = { email: 'z@v.com', password: '111111111111111' };

      const mockUser = {
        ...mockUserDto,
        save: jest.fn(),
      };

      mockModel.mockImplementation(async () => mockUser);

      const result = await userService.create(mockUserDto);
      expect(result).toEqual({
        message: 'user created',
        status: HttpStatus.CREATED,
      });
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find a user with its email and return it', async () => {
      const mockEmail = 'z@v.com';
      mockModel.findOne = jest.fn().mockReturnValue({
        _id: 'userId1',
        email: 'z@v.com',
        password: '111111111111111',
      });

      const result = await userService.find(mockEmail);
      expect(result).toEqual({
        _id: 'userId1',
        email: 'z@v.com',
        password: '111111111111111',
      });
      expect(mockModel.findOne).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a user with its id and return it', async () => {
      const mockUserId = 'userId1';
      mockModel.findById = jest.fn().mockReturnValue({
        _id: 'userId1',
        email: 'z@v.com',
        password: '111111111111111',
      });

      const result = await userService.findById(mockUserId);

      expect(result).toEqual({
        _id: 'userId1',
        email: 'z@v.com',
        password: '111111111111111',
      });
      expect(mockModel.findById).toHaveBeenCalled();
    });
  });
});
