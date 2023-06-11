import { Body, Controller, Post } from '@nestjs/common';
import { UserAlreadyExistsException } from 'src/exception/user-already-exists';
import { PostUser, User } from 'src/repository/user.repository';
import { UserService } from 'src/service/user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public addUser(@Body() user: PostUser): User {
    if (this.userService.findUserByUsername(user.username)) {
      throw new UserAlreadyExistsException();
    }

    return this.userService.addUser(user);
  }
}
