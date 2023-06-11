import { Module } from '@nestjs/common';
import { TodoController } from './controller/todo.controller';
import { TodoService } from './service/todo.service';
import { UserService } from './service/user.service';
import { TodoRepository } from './repository/todo.repository';
import { UserRepository } from './repository/user.repository';
import { UserController } from './controller/user.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';

const mockTodos = [
  {
    userId: 'clement',
    title: 'Finir le talk sur RxJS',
    done: false,
  },
  {
    userId: 'clement',
    title: 'Faire le ménage sans ménage',
    done: true,
  },
  {
    userId: 'clement',
    title: 'Blanchir des sous',
    done: true,
  },
  {
    userId: 'clement',
    title: 'Eplucher des tomates',
    done: false,
  },
];

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'dont-do-that',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [TodoController, UserController, AuthController],
  providers: [
    TodoService,
    UserService,
    TodoRepository,
    UserRepository,
    AuthGuard,
    AuthService,
  ],
})
export class AppModule {
  constructor(
    private userService: UserService,
    private todoService: TodoService,
  ) {
    this.userService.addUser({
      username: 'clement',
      password: 'password',
    });

    mockTodos.forEach((todo) => this.todoService.addTodo(todo));
  }
}
