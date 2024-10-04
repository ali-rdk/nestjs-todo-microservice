import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'libs/auth/jwt.guards';

@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Request() req) {
    const user = req.user;
    return this.todoService.create(createTodoDto, user.userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') todoId: string, @Request() req) {
    const userId = req.user.userId;
    return this.todoService.findOne(todoId, userId);
  }

  @Patch(':id')
  update(
    @Param('id') todoId: string,
    @Body(ValidationPipe) updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.todoService.update(todoId, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.todoService.remove(id, userId);
  }
}
