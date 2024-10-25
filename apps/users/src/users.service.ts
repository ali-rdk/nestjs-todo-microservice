import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../../libs/schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
      return {
        message: 'user created',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException();
    }
  }
}
