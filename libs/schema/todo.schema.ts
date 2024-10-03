import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @Prop({ required: true, unique: false })
  title: string;

  @Prop({ required: false, unique: false })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false })
  owner: User;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
