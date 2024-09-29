import { Controller, Get } from '@nestjs/common';
import { TodoService } from './todo.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern()
  create() {}
}
