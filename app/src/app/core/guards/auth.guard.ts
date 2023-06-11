import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      switchMap((loggedIn) => {
        if (loggedIn) {
          return of(true);
        } else {
          const isLoginPage = state.url.startsWith('/login');
          if (isLoginPage) {
            return of(true);
          } else {
            this.router.navigate(['/login']);
            return of(false);
          }
        }
      })
    );
  }
}
