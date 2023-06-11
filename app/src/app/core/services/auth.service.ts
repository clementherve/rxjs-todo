import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  map,
  of,
  share,
  startWith,
  timer,
} from 'rxjs';

export class AuthError {
  constructor(public code: number, public message: string) {}
}
export type Token = string;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base: string = 'http://localhost:3000';
  private _token$ = new Subject();
  private _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public token$: Observable<Token | null> = this._token$.pipe(
    startWith<any>(this.getTokenFromStorage()),
    share({
      connector: () => new ReplaySubject(1),
    })
  );

  public isLoggedIn$: Observable<boolean> = this.token$.pipe(
    map((token: any) => !this.isTokenExpired(token)),
    share({
      connector: () => new ReplaySubject(1),
    })
  );
  constructor(private httpClient: HttpClient) {}

  public loginWithCredentials$(username: string, password: string): Observable<boolean | AuthError> {
    return this.httpClient
      .post(`${this.base}/auth/login`, {
        username,
        password,
      })
      .pipe(
        map((response: any) => {
          const token = response.access_token;
          const isExpired = this.isTokenExpired(token);
          if (isExpired) {
            return false;
          }

          this._token$.next(token);
          this._isLoggedIn$.next(true);
          localStorage.setItem('token', token);
          return true;
        }),
        catchError((err) => {
          const code = err.status;
          const status = err.statusText;
          this._isLoggedIn$.next(false);
          return of(new AuthError(code, status));
        }),
        share({
          connector: () => new ReplaySubject(1),
          resetOnComplete: () => timer(1000 * 60), // 60s
        })
      );
  }

  private getTokenFromStorage(): Token | undefined {
    const token = localStorage.getItem('token') ?? undefined;

    if (this.isTokenExpired(token)) {
      return undefined;
    }

    return token;
  }

  private isTokenExpired(token: string | undefined): boolean {
    if (!token) {
      return true;
    }
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  public logout() {
    localStorage.removeItem('token');
    this._isLoggedIn$.next(false);
    this._token$.next(undefined);
  }
}
