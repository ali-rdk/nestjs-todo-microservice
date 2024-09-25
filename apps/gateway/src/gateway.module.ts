import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [UsersModule, TodoModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
