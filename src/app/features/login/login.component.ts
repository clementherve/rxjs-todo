import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  public loginFormGroup: FormGroup;
  private authServiceSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('kminchelle', [Validators.required]),
      password: new FormControl('0lelplR', [Validators.required]),
    });
  }

  public onLoginFormSubmit() {
    const { username, password } = this.loginFormGroup.getRawValue();

    this.authServiceSubscription = this.authService
      .loginWithCredentials$(username, password)
      .pipe(
        filter(Boolean),
        tap(() => this.router.navigate(['/todos']))
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.authServiceSubscription?.unsubscribe();
  }
}
