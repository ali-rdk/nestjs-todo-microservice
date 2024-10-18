import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoPayloadDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  owner?: string;
}
