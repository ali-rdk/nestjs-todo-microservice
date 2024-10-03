import { Controller, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTodoDto } from './dto/create-todo,dto';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: 'todo-create' })
  create(@Payload(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @MessagePattern({ cmd: 'todo-findOne' })
  findOne(@Payload() data) {
    return this.todoService.findOne(data.todoId, data.userId);
  }

  @MessagePattern({ cmd: 'todo-findAll' })
  findAll(@Payload() data) {
    return this.todoService.findAll(data.userId);
  }

  @MessagePattern({ cmd: 'todo-delete' })
  delete(@Payload() data) {
    return this.todoService.delete(data.todoId, data.userId);
  }

  @MessagePattern({ cmd: 'todo-update' })
  update(@Payload() data) {
    return this.todoService.update(data.todoId, data.userId, data.payload);
  }
}
