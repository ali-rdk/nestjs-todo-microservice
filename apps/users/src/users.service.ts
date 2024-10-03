import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../../libs/schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  findAll() {
    return 'Hello World!';
  }

  find(email) {
    return this.userModel.findOne({ email: email });
  }

  findById(id) {
    return this.userModel.findById(id);
  }

  async create(data: CreateUserDto) {
    try {
      const newUser = new this.userModel(data);
      newUser.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  update(id, payload: UpdateUserDto) {
    return `${id}, ${payload}`;
  }

  delete(id) {
    return id;
  }
}
