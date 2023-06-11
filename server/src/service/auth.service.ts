import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { PostUser } from 'src/repository/user.repository';
import { createHash } from 'crypto';
import { PermissionDenied } from 'src/exception/permission-denied';
import { UserNotFound } from 'src/exception/user-not-found';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(postUser: PostUser) {
    const user = this.userService.findUserByUsername(postUser.username);

    if (!user) {
      throw new UserNotFound();
    }

    const isLoggedIn =
      createHash('sha256').update(postUser.password).digest('hex') ===
      user?.password;

    if (!isLoggedIn) {
      throw new PermissionDenied();
    }

    return {
      access_token: await this.jwtService.signAsync({ userId: user.username }),
    };
  }
}
