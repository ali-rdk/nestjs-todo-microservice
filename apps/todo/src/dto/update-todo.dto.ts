import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateTodoDto } from './create-todo,dto';
import { Type } from 'class-transformer';

export class UpdateTodoDto {
  @IsString()
  todoId?: string;

  @IsString()
  userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTodoDto)
  payload: CreateTodoDto;
}
