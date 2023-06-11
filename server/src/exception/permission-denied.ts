import { HttpException } from '@nestjs/common';

export class PermissionDenied extends HttpException {
  constructor() {
    super('PermissionDenied', 400);
  }
}
