import { AuthService } from './../service/auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PostUser } from 'src/repository/user.repository';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() postUser: PostUser,
  ): Promise<Record<string, string>> {
    return await this.authService.signIn(postUser);
  }
}
