import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_CONTRACTS } from 'libs/contracts/users.contracts';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: USER_CONTRACTS.FIND_ALL })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: USER_CONTRACTS.FIND_ONE })
  find(email) {
    return this.usersService.find(email);
  }

  @MessagePattern({ cmd: USER_CONTRACTS.CREATE })
  create(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: USER_CONTRACTS.UPDATE })
  update(id, payload) {
    return this.usersService.update(id, payload);
  }

  @MessagePattern({ cmd: USER_CONTRACTS.DELETE })
  delete(id) {
    return this.usersService.delete(id);
  }

  @MessagePattern({ cmd: USER_CONTRACTS.FIND_BY_ID })
  findById(id) {
    return this.usersService.findById(id);
  }
}
