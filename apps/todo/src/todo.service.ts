import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from 'libs/schema/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo,dto';
import { ITodo } from 'libs/interfaces/todo.interface';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  create(createTodoDto: CreateTodoDto) {
    try {
      const newTodo = new this.todoModel(createTodoDto);
      newTodo.save();

      return {
        message: 'todo created',
        data: newTodo._id,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException();
    }
  }

  async findOne(todoId, userId) {
    const owned = await this.isOwned(todoId, userId);

    if (!owned) {
      return new NotFoundException();
    }

    const todo = await this.todoModel.findById(todoId);

    if (!todo) {
      return new NotFoundException();
    }

    return {
      todo,
      status: HttpStatus.FOUND,
    };
  }

  async findAll(userId: string) {
    const todos = await this.todoModel.find({ owner: userId }).exec();

    if (!todos) {
      return new NotFoundException();
    }

    return {
      todos,
      status: HttpStatus.FOUND,
    };
  }

  async delete(todoId, userId) {
    const owned = await this.isOwned(todoId, userId);
    if (!owned) {
      return new NotFoundException();
    }

    const deletedTodo = await this.todoModel.findByIdAndDelete(todoId).exec();

    if (!deletedTodo) {
      return new NotFoundException();
    }

    return {
      message: 'todo deleted',
      status: HttpStatus.OK,
    };
  }

  async update(todoId: string, userId, payload: ITodo) {
    const owned = await this.isOwned(todoId, userId);
    if (!owned) {
      return new NotFoundException();
    }

    try {
      const updatedTodo = await this.todoModel
        .findByIdAndUpdate(todoId, payload)
        .exec();

      if (!updatedTodo) {
        return new NotFoundException();
      }

      return {
        message: 'todo updated',
        todo: updatedTodo,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException();
    }
  }

  async isOwned(todoId, userId) {
    const todo = await this.todoModel.findById(todoId, 'owner').exec();
    if (!todo) {
      return new NotFoundException();
    }

    return todo.owner.toString() === userId;
  }
}
