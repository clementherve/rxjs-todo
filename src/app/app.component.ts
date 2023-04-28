import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public loggedIn$;
  constructor(private authService: AuthService) {
    this.loggedIn$ = this.authService.isLoggedIn$;
  }

  public logout() {
    this.authService.logout();
  }
}
