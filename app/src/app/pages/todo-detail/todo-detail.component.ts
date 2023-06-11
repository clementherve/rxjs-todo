import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, take, tap } from 'rxjs';
import { TodosService } from 'src/app/core/services/todo.service';

@Component({
  selector: 'todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css'],
})
export class TodoDetailComponent implements OnDestroy {
  public todo$?: Observable<any>;
  subscription: any;

  constructor(private todosService: TodosService, private activatedRoute: ActivatedRoute, private router: Router) {
    const id = this.activatedRoute.snapshot.params['todoId'];
    this.todo$ = this.todosService.getTodo$(id);
  }

  public deleteTodo(todo: any) {
    this.subscription = this.todosService
      .deleteTodo$(todo)
      .pipe(
        switchMap(() => this.todosService.getTodos$),
        tap(() => this.router.navigate(['/todos'])),
        take(1)
      )
      .subscribe(); // must unsubscribe!
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
