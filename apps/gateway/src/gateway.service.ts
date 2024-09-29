import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  test() {
    return 'hello';
  }
}
