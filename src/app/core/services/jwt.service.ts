import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  filter,
  map,
  of,
  share,
  switchMap,
  tap,
  timer,
} from 'rxjs';

export type Token = string;

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private token$: BehaviorSubject<Token | undefined> = new BehaviorSubject<
    Token | undefined
  >(undefined);

  constructor() {}

  public setToken$(token: Token | undefined): Observable<boolean> {
    this.token$.next(token);

    if (token !== undefined) {
      this.storeToken(token);
    } else {
      this.removeToken();
    }

    return this.isLoggedIn$;
  }

  public getToken$ = this.token$.pipe(
    tap(() => console.log('got token')),
    share({
      connector: () => new ReplaySubject(1),
      resetOnComplete: () => timer(1).pipe(tap(() => console.log('times up'))),
    }),
    tap(() => console.log('replayed token'))
  );

  public userId$ = this.token$.pipe(
    filter(Boolean),
    map((token) => (jwt_decode(token) as any)['id']),
    share({
      connector: () => new ReplaySubject(1),
    })
  );

  public isTokenExpired$ = this.getToken$.pipe(
    switchMap((token) => {
      if (!token) {
        return of(true);
      } else {
        return of(token).pipe(
          map((token) => (jwt_decode(token) as any)['exp']),
          map((expiryTime) => {
            if (expiryTime) {
              const currentTime = new Date().getTime();
              const remainingTime = (1000 * expiryTime - currentTime) / 1000;
              return remainingTime < 0;
            }
            return true;
          }),
          share({
            connector: () => new ReplaySubject(1),
            resetOnComplete: () => timer(50 * 60 * 1000),
          })
        );
      }
    })
  );

  public isLoggedIn$ = this.isTokenExpired$.pipe(
    map((isExpired) => !isExpired),
    share({ connector: () => new ReplaySubject(1) })
  );

  // convenience method to get / store / remove token from memory
  private storeToken(token: Token) {
    localStorage.setItem('token', token);
  }

  public getStoredToken(): Token | undefined {
    return localStorage.getItem('token') ?? undefined;
  }

  private removeToken() {
    localStorage.removeItem('token');
  }
}
