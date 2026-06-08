import { Component, HostListener, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Pass 'login' or 'signup' to override the right-side CTA on auth pages */
  readonly action = input<'login' | 'signup' | null>(null);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;
  readonly open = signal(false);

  toggle() {
    this.open.update(v => !v);
  }

  logout() {
    this.open.set(false);
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.avatar-menu')) {
      this.open.set(false);
    }
  }
}
