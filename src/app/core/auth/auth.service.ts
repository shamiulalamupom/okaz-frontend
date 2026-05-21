import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthState, LoginPayload, RegisterPayload, User } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Service HTTP Angular pour communiquer avec le backend API
  private readonly http = inject(HttpClient);

  // Identifie si l’exécution se fait côté navigateur (important pour SSR)
  private readonly platformId = inject(PLATFORM_ID);

  // Clé utilisée pour stocker l’état d’authentification dans le localStorage
  private readonly storageKey = 'auth_state';

  // Signal global contenant l’état utilisateur (user + token)
  private readonly state = signal<AuthState>(this.readStoredState());

  // Accès réactif à l’utilisateur connecté
  readonly user = computed(() => this.state().user);

  // Accès réactif au token JWT
  readonly token = computed(() => this.state().token);

  // Booléen indiquant si l’utilisateur est authentifié
  readonly isAuthenticated = computed(() => !!this.state().token);

  login(payload: LoginPayload) {
    // Appel API de connexion
    return this.http.post<{ user: User; token: string }>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => {
        // Mise à jour de l’état après login réussi
        this.setState({
          user: response.user,
          token: response.token,
        });
      }),
    );
  }

  register(payload: RegisterPayload) {
    // Appel API d’inscription utilisateur
    return this.http
      .post<{ user: User; token: string }>(
        `${environment.apiUrl}/auth/register`,
        payload,
      )
      .pipe(
        tap((response) => {
          // Connexion automatique après inscription
          this.setState({
            user: response.user,
            token: response.token,
          });
        }),
      );
  }

  logout() {
    // Réinitialisation complète de la session utilisateur
    this.setState({
      user: null,
      token: null,
    });
  }

  private setState(state: AuthState) {
    // Mise à jour du signal Angular
    this.state.set(state);

    // Sauvegarde persistante uniquement côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
  }

  private readStoredState(): AuthState {
    // Protection SSR : localStorage indisponible côté serveur
    if (!isPlatformBrowser(this.platformId)) {
      return { user: null, token: null };
    }

    const raw = localStorage.getItem(this.storageKey);

    // Aucun état sauvegardé
    if (!raw) {
      return { user: null, token: null };
    }

    try {
      // Lecture de l’état stocké
      return JSON.parse(raw) as AuthState;
    } catch {
      // Sécurité si données corrompues
      return { user: null, token: null };
    }
  }
}