import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, ReplaySubject, Subject, share } from 'rxjs';

export type Todo = {
  id: string;
  userId: string;
  title: string;
  done: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private apiService: ApiService) {}

  public getTodos$ = this.apiService.get<Todo[]>(`/todos`).pipe(
    share({
      connector: () => new ReplaySubject(1),
    })
  );

  public getTodo$(id: number): Observable<Todo[]> {
    return this.apiService.get<Todo[]>(`/todos/${id}`);
  }

  public markTodoAs$(todo: Todo, done: boolean) {
    return this.apiService.put<Partial<Todo>, Todo>('/todos', { ...todo, done: done });
  }

  public addTodo$(todo: Partial<Todo>): Observable<Todo> {
    return this.apiService.post<Partial<Todo>, Todo>('/todos', todo);
  }

  public deleteTodo$(todo: any): Observable<boolean> {
    return this.apiService.delete<boolean>(`/todos/${todo.id}`);
  }
}
