import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import {
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('Todo Service', () => {
  let todoService: TodoService;
  let mockModel;

  beforeEach(async () => {
    mockModel = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken('Todo'),
          useValue: mockModel,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo successfully', () => {
      const createTodo: CreateTodoDto = {
        title: 'title',
        description: 'desc',
        owner: 'user1Id',
      };

      const mockTodo = {
        _id: 'mockTodo1',
        ...createTodo,
        save: jest.fn().mockReturnValue(undefined),
      };

      mockModel.mockImplementation(() => mockTodo);

      const result = todoService.create(createTodo);

      expect(result).toEqual({
        message: 'todo created',
        data: 'mockTodo1',
        status: HttpStatus.CREATED,
      });
      expect(mockTodo.save).toHaveBeenCalled();
    });

    it('should return InternalServerErrorException when save fails', async () => {
      const createTodo: CreateTodoDto = {
        title: 'title',
        description: 'desc',
        owner: 'userId1',
      };

      const mockTodo = {
        ...createTodo,
        save: jest.fn().mockRejectedValue(new Error('failed')),
      };

      mockModel.mockImplementation(async () => mockTodo);

      const result = await todoService.create(createTodo);

      expect(result).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if todo is not owned by user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(false);
      mockModel.findById = jest.fn().mockResolvedValue(null);

      const result = await todoService.findOne(todoId, userId);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(todoService.isOwned).toHaveBeenCalledWith(todoId, userId);
      expect(mockModel.findById).not.toHaveBeenCalledWith(todoId);
    });

    it('should throw NotFoundException if todo do not exists', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);
      mockModel.findById = jest.fn().mockResolvedValue(null);

      const result = await todoService.findOne(todoId, userId);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(todoService.isOwned).toHaveBeenCalledWith(todoId, userId);
      expect(mockModel.findById).toHaveBeenCalledWith(todoId);
    });

    it('should return todo and status if todo is found and owned by the user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      const mockTodo = { _id: todoId, title: 'test' };
      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);
      mockModel.findById = jest.fn().mockResolvedValue(mockTodo);

      const result = await todoService.findOne(todoId, userId);

      expect(result).toEqual({
        todo: mockTodo,
        status: HttpStatus.FOUND,
      });
      expect(todoService.isOwned).toHaveBeenCalledWith(todoId, userId);
      expect(mockModel.findById).toHaveBeenCalledWith(todoId);
    });
  });

  describe('findAll', () => {
    it('should return NotFoundException if no todos are found', async () => {
      mockModel.find = jest.fn().mockReturnValue(null);

      const userId = 'userId1';

      const result = await todoService.findAll(userId);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(mockModel.find).toHaveBeenCalledWith({ owner: userId });
    });

    it('should return array of todos if there are todos and owned by the user', async () => {
      const userId = 'userId1';
      const mockTodo1 = {
        _id: 'todoId1',
        owener: userId,
        title: 'test',
        description: 'test',
      };
      const mockTodo2 = {
        _id: 'todoId2',
        owener: userId,
        title: 'test',
        description: 'test',
      };
      const mockTodos = [mockTodo1, mockTodo2];
      mockModel.find = jest.fn().mockReturnValue(mockTodos);

      const result = await todoService.findAll(userId);
      expect(result).toEqual({ todos: mockTodos, status: 302 });
      expect(mockModel.find).toHaveBeenCalledWith({ owner: userId });
    });
  });

  describe('delete', () => {
    it('should return NotFoundException if todo is not owned by the user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';
      mockModel.findByIdAndDelete = jest.fn().mockReturnValue(null);

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(false);

      const result = await todoService.delete(todoId, userId);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(mockModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should return NotFoundException if there is no todo owned by the user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';
      mockModel.findByIdAndDelete = jest.fn().mockReturnValue(null);

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);

      const result = await todoService.delete(todoId, userId);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalled();
    });

    it('should return delete message if the todo is owned by the user and exists', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      const mockTodo = {
        _id: todoId,
        title: 'test',
        description: 'test',
        owner: userId,
      };
      mockModel.findByIdAndDelete = jest.fn().mockReturnValue(mockTodo);

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);

      const result = await todoService.delete(todoId, userId);

      expect(result).toEqual({ message: 'todo deleted', status: 200 });
      expect(mockModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should return NotFoundException if todo is not owned by the user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      const mockpayload = {
        _id: todoId,
        title: 'test',
        description: 'test',
        owner: userId,
      };
      mockModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(false);

      const result = await todoService.update(todoId, userId, mockpayload);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(mockModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should return NotfoundException if there is no todo owned by user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      const mockpayload = {
        _id: todoId,
        title: 'test',
        description: 'test',
        owner: userId,
      };
      mockModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);

      const result = await todoService.update(todoId, userId, mockpayload);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        todoId,
        mockpayload,
      );
    });

    it('should return the updated todo if the todo found and owned by the user', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      const mockpayload = {
        _id: todoId,
        title: 'test',
        description: 'test',
        owner: userId,
      };
      mockModel.findByIdAndUpdate = jest.fn().mockReturnValue(mockpayload);

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);

      const result = await todoService.update(todoId, userId, mockpayload);

      expect(result).toEqual({
        message: 'todo updated',
        todo: mockpayload,
        status: 200,
      });
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        todoId,
        mockpayload,
      );
    });

    it('should return the InternalServerErrorException if findByIdAndUpdate failed', async () => {
      const todoId = 'todoId1';
      const userId = 'userId1';

      const mockpayload = {
        _id: todoId,
        title: 'test',
        description: 'test',
        owner: userId,
      };
      mockModel.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('failed'));

      jest.spyOn(todoService, 'isOwned').mockResolvedValue(true);

      const result = await todoService.update(todoId, userId, mockpayload);

      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        todoId,
        mockpayload,
      );
    });
  });
});
