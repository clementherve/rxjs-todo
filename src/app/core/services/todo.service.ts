import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ReplaySubject, map, share } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private apiService: ApiService, private jwtService: JwtService) {}

  public getTodos$ = this.apiService.get(`/users/1/todos`).pipe(
    map((response: any) => response.todos),
    share({
      connector: () => new ReplaySubject(1),
    })
  );

  public getTodo(id: number) {
    return this.apiService
      .get(`/todos/${id}`)
      .pipe(map((response: any) => response));
  }

  public markTodoAs(id: number, done: boolean) {
    return this.apiService
      .patch(`/todos/${id}`, { completed: done })
      .pipe(map((response: any) => response));
  }
}
