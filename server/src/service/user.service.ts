import { PostUser, User } from './../repository/user.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { createHash } from 'crypto';
import { UserNotFound } from '../exception/user-not-found.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public findUserByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  public addUser(user: PostUser) {
    const hashedPassword = createHash('sha256')
      .update(user.password)
      .digest('hex');

    this.userRepository.add({
      username: user.username,
      password: hashedPassword,
    });

    return {
      username: user.username,
    };
  }

  public deleteUser(user: User) {
    if (!this.userRepository.findByUsername(user.username)) {
      throw new UserNotFound();
    }
    return this.userRepository.delete(user);
  }
}
