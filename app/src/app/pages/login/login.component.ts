import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthError, AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  public loginFormGroup: FormGroup;
  public login$: Observable<boolean | AuthError>;
  public onSubmit$ = new Subject();

  constructor(private router: Router, private authService: AuthService) {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('clement', [Validators.required]),
      password: new FormControl('password', [Validators.required]),
    });

    this.login$ = this.onSubmit$.pipe(
      switchMap(() => {
        const { username, password } = this.loginFormGroup.getRawValue();

        return this.authService.loginWithCredentials$(username, password).pipe(
          switchMap((isLoggedIn) => {
            if (!(isLoggedIn instanceof AuthError)) {
              this.router.navigate(['/todos']);
              return of(isLoggedIn);
            } else {
              return of(isLoggedIn);
            }
          })
        );
      })
    );
  }

  public onLoginFormSubmit() {
    this.onSubmit$.next(true);
  }

  public ngOnDestroy(): void {
    this.onSubmit$.unsubscribe();
  }
}
