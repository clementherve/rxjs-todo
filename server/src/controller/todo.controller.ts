import { TodoService } from './../service/todo.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoNotFound } from 'src/exception/todo-not-found';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  PostTodo,
  PostTodoSchema,
  Todo,
  TodoSchema,
} from 'src/repository/todo.repository';

@Controller('/todos')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  getTodos(@Req() request): Todo[] {
    const userId = request['user'].userId;

    return this.todoService.getTodosForUser({
      username: userId,
    });
  }

  @Get('/:todoId')
  getTodo(@Req() request): Todo {
    const userId = request['user'].userId;
    const todoId = request.params.todoId;

    const todo = this.todoService
      .getTodosForUser({ username: userId })
      .find((todo) => todo.id === todoId);

    if (!todo) {
      throw new TodoNotFound();
    }

    return todo;
  }

  @Post()
  addTodo(@Body() todo: PostTodo, @Req() request): Todo {
    const validation = PostTodoSchema.safeParse(todo);

    if (!validation.success) {
      throw new HttpException(validation, 400);
    }

    todo['userId'] = request['user'].userId;

    return this.todoService.addTodo(todo);
  }

  @Put()
  updateTodo(@Body() todo: Todo, @Req() request): Todo {
    const validation = TodoSchema.safeParse(todo);

    if (!validation.success) {
      throw new HttpException(validation, 400);
    }

    todo.userId = request['user'].userId;

    return this.todoService.updateTodo(todo);
  }

  @Delete('/:todoId')
  deleteTodo(@Req() request) {
    const userId = request['user'].userId;
    const todoId = request.params.todoId;

    const todo = this.todoService
      .getTodosForUser({ username: userId })
      .find((todo) => todo.id === todoId);

    if (!todo) {
      throw new TodoNotFound();
    }

    this.todoService.deleteTodo(todo);
  }
}
