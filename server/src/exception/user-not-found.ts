import { HttpException } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor() {
    super('UserNotFound', 404);
  }
}
