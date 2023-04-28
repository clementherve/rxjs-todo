import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  combineLatest,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Token } from '../services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('auth guard');
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
