// auth.service.ts
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { AuthState, LoginPayload, RegisterPayload, User } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'auth_state';

  private readonly state = signal<AuthState>(this.readStoredState());

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => !!this.state().token);

  login(payload: LoginPayload) {
    return this.http.post<{ user: User; token: string }>('/api/auth/login', payload).pipe(
      tap((response) => {
        this.setState({
          user: response.user,
          token: response.token,
        });
      }),
    );
  }

  register(payload: RegisterPayload) {
    return this.http.post<{ user: User; token: string }>('/api/auth/register', payload).pipe(
      tap((response) => {
        this.setState({
          user: response.user,
          token: response.token,
        });
      }),
    );
  }

  logout() {
    this.setState({
      user: null,
      token: null,
    });
  }

  private setState(state: AuthState) {
    this.state.set(state);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
  }

  private readStoredState(): AuthState {
    if (!isPlatformBrowser(this.platformId)) {
      return { user: null, token: null };
    }

    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return { user: null, token: null };
    }

    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      return { user: null, token: null };
    }
  }
}
