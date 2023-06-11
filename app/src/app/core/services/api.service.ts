import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base: string = 'http://localhost:3000';

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) {}

  public get<T>(path: string): Observable<T> {
    return this.authService.token$.pipe(
      switchMap((token) => {
        return this.httpClient.get(this.base + path, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }),
      this.redirectOnError()
    );
  }

  public post<T, V>(path: string, data: T): Observable<V> {
    return this.authService.token$.pipe(
      switchMap((token) =>
        this.httpClient.post<T>(this.base + path, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ),
      this.redirectOnError()
    );
  }

  public put<T, V>(path: string, data: T): Observable<V> {
    return this.authService.token$.pipe(
      switchMap((token) =>
        this.httpClient.put(this.base + path, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ),
      this.redirectOnError()
    );
  }

  public delete<T>(path: string): Observable<T> {
    return this.authService.token$.pipe(
      switchMap((token) =>
        this.httpClient.delete(this.base + path, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ),
      this.redirectOnError()
    );
  }

  private redirectOnError(): any {
    return catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        this.router.navigate(['/login']);
      }
      return of([]);
    });
  }
}
