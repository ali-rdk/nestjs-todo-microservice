import { Controller } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
}
