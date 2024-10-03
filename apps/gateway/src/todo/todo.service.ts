import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TodoService {
  constructor(@Inject('TODO_SERVICE') private todoClient: ClientProxy) {}
  create(createTodoDto: CreateTodoDto, userId) {
    return this.todoClient.send(
      { cmd: 'todo-create' },
      {
        title: createTodoDto.title,
        description: createTodoDto.description,
        owner: userId,
      },
    );
  }

  findAll(userId: string) {
    console.log(userId);

    return this.todoClient.send({ cmd: 'todo-findAll' }, { userId });
  }

  findOne(todoId: string, userId: string) {
    return this.todoClient.send(
      { cmd: 'todo-findOne' },
      {
        todoId,
        userId,
      },
    );
  }

  update(todoId: string, updateTodoDto: UpdateTodoDto, userId: string) {
    return this.todoClient.send(
      { cmd: 'todo-update' },
      { todoId, userId, payload: updateTodoDto },
    );
  }

  remove(todoId: string, userId: string) {
    return this.todoClient.send({ cmd: 'todo-delete' }, { todoId, userId });
  }
}
