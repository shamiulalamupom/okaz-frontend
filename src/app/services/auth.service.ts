
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  // ========================
  // AUTH REQUESTS
  // ========================

  signup(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/login`, data).subscribe({
        next: (res) => {
          this.saveToken(res.token);
          this.decodeAndSetUser(res.token);
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // ========================
  // TOKEN MANAGEMENT
  // ========================

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ========================
  // USER MANAGEMENT
  // ========================

  private decodeAndSetUser(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.currentUserSubject.next(payload);
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
}