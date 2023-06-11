import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const PostTodoSchema = z.object({
  title: z.string(),
  done: z.boolean(),
});

export const TodoSchema = PostTodoSchema.augment({
  userId: z.string(),
  id: z.string(),
});

export type Todo = z.infer<typeof TodoSchema>;
export type PostTodo = z.infer<typeof PostTodoSchema>;

@Injectable()
export class TodoRepository {
  private todos: Todo[] = [];

  public findAll() {
    return this.todos;
  }

  public findById(id: string) {
    return this.todos.find((todo) => todo.id === id);
  }

  public add(todo: PostTodo): Todo {
    const newTodo = { id: uuidv4(), ...todo };
    this.todos.push(newTodo);
    return newTodo;
  }

  public update(todo: Todo): Todo {
    const index = this.findIndex(todo.id);
    this.todos[index] = todo;
    return todo;
  }

  public delete(todo: Todo): boolean {
    this.todos = this.todos.filter((_todo) => _todo.id !== todo.id);
    return this.findIndex(todo.id) === -1;
  }

  private findIndex(id: string): number {
    return this.todos.findIndex((todo) => todo.id === id);
  }
}
