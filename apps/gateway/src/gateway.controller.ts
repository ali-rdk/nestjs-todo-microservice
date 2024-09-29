import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from 'libs/auth/jwt.guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
}
