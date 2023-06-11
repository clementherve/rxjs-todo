import { Component, HostListener } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { Todo, TodosService } from 'src/app/core/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  public todos$: Observable<Todo[]>;
  private addTodoShown = false;

  @HostListener('document:keydown.escape', ['$event'])
  onKeyup(event: any) {
    this.addTodoShown = false;
  }

  constructor(private todoService: TodosService) {
    this.todos$ = this.todoService.getTodos$;
  }

  public onCheckboxChanged(event: any, todo: any) {
    const done = event.srcElement.checked;
    this.todos$ = this.todoService.markTodoAs$(todo, done).pipe(switchMap(() => this.todoService.getTodos$));
  }

  public addTodo$(event: any) {
    this.toggleAddTodo();
    const title = event.originalTarget.value;
    this.todos$ = this.todoService.addTodo$({ title, done: false }).pipe(
      switchMap(() => this.todoService.getTodos$),
      tap(() => (event.originalTarget.value = ''))
    );
  }

  public toggleAddTodo() {
    this.addTodoShown = !this.addTodoShown;
  }

  public get isAddTodoShown() {
    return this.addTodoShown;
  }
}
