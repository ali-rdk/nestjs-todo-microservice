import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateTodoPayloadDto } from './update-todo-payload.dto';

export class UpdateTodoDto {
  @IsString()
  todoId?: string;

  @IsString()
  userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTodoPayloadDto)
  payload: UpdateTodoDto;
}
