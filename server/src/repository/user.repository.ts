import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

export const ResponseUserSchema = z.object({
  username: z.string(),
});

export const PostUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof ResponseUserSchema>;
export type PostUser = z.infer<typeof PostUserSchema>;

@Injectable()
export class UserRepository {
  private users: PostUser[] = [];

  public findAll() {
    return this.users;
  }

  public findByUsername(username: string) {
    return this.users.find((_user) => _user.username === username);
  }

  public add(user: PostUser) {
    this.users.push(user);
    return user;
  }

  public update(user: User) {
    const index = this.findIndex(user.username);
    this.users[index] = user;
    return user;
  }

  public delete(user: User) {
    this.users = this.users.filter((_user) => _user.username !== user.username);
    return this.findIndex(user.username) === -1;
  }

  private findIndex(id: string): number {
    return this.users.findIndex((user) => user.username === id);
  }
}
