import { Injectable } from '@nestjs/common';
import { PermissionDenied } from 'src/exception/permission-denied';
import { TodoNotFound } from 'src/exception/todo-not-found';
import { PostTodo, Todo, TodoRepository } from 'src/repository/todo.repository';
import { User } from 'src/repository/user.repository';

@Injectable()
export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  public findTodoById(todo: Todo) {
    this.todoExistsGuard(todo);
    return this.todoRepository.findById(todo.id);
  }

  public getTodosForUser(user: User) {
    return this.todoRepository
      .findAll()
      .filter((todo) => todo.userId === user?.username);
  }

  public addTodo(todo: PostTodo) {
    const newTodo = this.todoRepository.add(todo);
    return newTodo;
  }

  public updateTodo(todo: Todo) {
    this.todoExistsGuard(todo);
    this.todoBelongsToSameUserGuard(todo);

    return this.todoRepository.update(todo);
  }

  public deleteTodo(todo: Todo): boolean {
    console.log('1', todo);
    this.todoExistsGuard(todo);
    console.log('2', todo);

    this.todoBelongsToSameUserGuard(todo);
    console.log('3', todo);

    return this.todoRepository.delete(todo);
  }

  private todoExistsGuard(todo: Todo) {
    const transientTodo = this.todoRepository.findById(todo.id);
    if (!transientTodo) {
      throw new TodoNotFound();
    }
  }

  private todoBelongsToSameUserGuard(todo: Todo) {
    const transientTodo = this.todoRepository.findById(todo.id);

    if (todo.userId !== transientTodo?.userId) {
      throw new PermissionDenied();
    }
  }
}
