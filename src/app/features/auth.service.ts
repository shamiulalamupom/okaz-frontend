
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: any = null;

  constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post<any>('/api/login', payload).pipe(
      tap((user) => {
        this._user = user;
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this._user = null;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this._user || !!localStorage.getItem('user');
  }

  get user() {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem('user') || 'null');
    }
    return this._user;
  }
}