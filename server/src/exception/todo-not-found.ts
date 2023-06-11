import { HttpException } from '@nestjs/common';

export class TodoNotFound extends HttpException {
  constructor() {
    super('TodoNotFound :(', 404);
  }
}
