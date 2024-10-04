import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ClientProxy } from '@nestjs/microservices';
import { TODO_CONTRACTS } from 'libs/contracts/todo.contracts';

@Injectable()
export class TodoService {
  constructor(@Inject('TODO_SERVICE') private todoClient: ClientProxy) {}
  create(createTodoDto: CreateTodoDto, userId) {
    return this.todoClient.send(
      { cmd: TODO_CONTRACTS.CREATE },
      {
        title: createTodoDto.title,
        description: createTodoDto.description,
        owner: userId,
      },
    );
  }

  findAll(userId: string) {
    return this.todoClient.send({ cmd: TODO_CONTRACTS.FIND_ALL }, { userId });
  }

  findOne(todoId: string, userId: string) {
    return this.todoClient.send(
      { cmd: TODO_CONTRACTS.FIND_ONE },
      {
        todoId,
        userId,
      },
    );
  }

  update(todoId: string, updateTodoDto: UpdateTodoDto, userId: string) {
    return this.todoClient.send(
      { cmd: TODO_CONTRACTS.UPDATE },
      { todoId, userId, payload: updateTodoDto },
    );
  }

  remove(todoId: string, userId: string) {
    return this.todoClient.send(
      { cmd: TODO_CONTRACTS.DELETE },
      { todoId, userId },
    );
  }
}
