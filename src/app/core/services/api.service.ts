import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  ReplaySubject,
  catchError,
  map,
  of,
  share, 
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Token } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base: string = 'https://dummyjson.com';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  public get(path: string) {
    return this.authService.getToken$.pipe(
      this.redirectToLogin(),
      switchMap((token) =>
        this.httpClient.get(this.base + path, {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        })
      )
    );
  }

  public post(path: string, data: any) {
    return this.authService.getToken$.pipe(
      this.redirectToLogin(),
      switchMap((token) =>
        this.httpClient.post(this.base + path, data, {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        })
      )
    );
  }

  public patch(path: string, data: any) {
    return this.authService.getToken$.pipe(
      this.redirectToLogin(),
      switchMap((token) =>
        this.httpClient.patch(this.base + path, data, {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        })
      )
    );
  }

  private redirectToLogin() {
    return tap(async (token: Token | undefined) => {
      if (!token) {
        await this.router.navigate(['/login']);
      }
    });
  }
}
