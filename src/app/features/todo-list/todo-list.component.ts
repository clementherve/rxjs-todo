import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { TodosService } from 'src/app/core/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  public todos$: Observable<any>;
  public done$: Observable<any>;

  public addTodoFormGroup: FormGroup;

  constructor(private todoService: TodosService) {
    this.todos$ = this.todoService.getTodos$.pipe(
      map((todos) => todos.filter((todo: any) => !todo.completed))
    );
    this.done$ = this.todoService.getTodos$.pipe(
      map((todos) => todos.filter((todo: any) => todo.completed))
    );

    this.addTodoFormGroup = new FormGroup({
      todoText: new FormControl(null, Validators.required),
    });
  }

  public onCheckboxChanged(event: any, todo: any) {
    const isChecked = event.originalTarget.checked;

    this.todos$ = this.todoService.markTodoAs(todo.id, isChecked).pipe(
      switchMap(() => this.todoService.getTodos$),
      map((todos) => todos.filter((todo: any) => !todo.completed))
    );

    this.done$ = this.todoService.markTodoAs(todo.id, isChecked).pipe(
      switchMap(() => this.todoService.getTodos$),
      map((todos) => todos.filter((todo: any) => todo.completed))
    );
  }

  public get isAddTodoShown() {
    return false;
  }
}
