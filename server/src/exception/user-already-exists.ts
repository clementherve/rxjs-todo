import { HttpException } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('UserAlreadyExistsException', 400);
  }
}
