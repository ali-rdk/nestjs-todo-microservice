import { Controller, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TODO_CONTRACTS } from 'libs/contracts/todo.contracts';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: TODO_CONTRACTS.CREATE })
  create(@Payload(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @MessagePattern({ cmd: TODO_CONTRACTS.FIND_ONE })
  findOne(@Payload() data) {
    return this.todoService.findOne(data.todoId, data.userId);
  }

  @MessagePattern({ cmd: TODO_CONTRACTS.FIND_ALL })
  findAll(@Payload() data) {
    return this.todoService.findAll(data.userId);
  }

  @MessagePattern({ cmd: TODO_CONTRACTS.DELETE })
  delete(@Payload() data) {
    return this.todoService.delete(data.todoId, data.userId);
  }

  @MessagePattern({ cmd: TODO_CONTRACTS.UPDATE })
  update(@Payload(ValidationPipe) updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(
      updateTodoDto.todoId,
      updateTodoDto.userId,
      updateTodoDto.payload,
    );
  }
}
