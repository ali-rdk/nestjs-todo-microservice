import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'users-getAll' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'users-find' })
  find(email) {
    return this.usersService.find(email);
  }

  @MessagePattern({ cmd: 'users-create' })
  create(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'users-update' })
  update(id, payload) {
    return this.usersService.update(id, payload);
  }

  @MessagePattern({ cmd: 'users-delete' })
  delete(id) {
    return this.usersService.delete(id);
  }

  @MessagePattern({ cmd: 'users-findById' })
  findById(id) {
    return this.usersService.findById(id);
  }
}
