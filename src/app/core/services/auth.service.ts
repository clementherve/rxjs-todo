import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  combineLatest,
  map,
  of,
  share,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { JwtService, Token } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base: string = 'https://dummyjson.com';

  constructor(private httpClient: HttpClient, private jwtService: JwtService) {}

  public getToken$ = this.jwtService.getToken$;

  public isLoggedIn$ = combineLatest([
    this.jwtService.isLoggedIn$,
    this.tryLoginWithJwt$(),
  ]).pipe(map(([isLoggedIn, jwtLogin]) => isLoggedIn || jwtLogin));

  public loginWithCredentials$(
    username: string,
    password: string
  ): Observable<Token | undefined> {
    return this.httpClient
      .post(`${this.base}/auth/login`, {
        username,
        password,
      })
      .pipe(
        map((response: any) => response.token as Token),
        tap((token) => this.jwtService.setToken$(token)),
        catchError((err) => {
          const status = err.status;
          console.log({ status }); // todo: handle this properly
          throw new Error(status);
        }),
        share({
          connector: () => new ReplaySubject(1),
          resetOnComplete: () => timer(1000 * 60 * 5), // 5min
        })
      );
  }

  public tryLoginWithJwt$() {
    const token = this.jwtService.getStoredToken();
    return this.jwtService.setToken$(token);
  }

  public logout() {
    this.jwtService.setToken$(undefined);
  }
}
