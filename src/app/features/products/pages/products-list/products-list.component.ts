import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { Product } from '../../../../core/products/product.models';
import { ProductsService } from '../../../../core/products/products.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-products-list',
  imports: [CurrencyPipe, RouterLink, NavbarComponent],
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly categories = ['All', 'Grocery', 'Dairy', 'Snacks', 'Drinks', 'Household'];
  selectedCategory = 'All';

  private readonly palette = [
    { bg: '#c8fae8', fg: '#0f6e56' },
    { bg: '#fde8c8', fg: '#7c4700' },
    { bg: '#e8d5fb', fg: '#5b1fa8' },
    { bg: '#fbe8e8', fg: '#9b1a1a' },
    { bg: '#e8f0fb', fg: '#1a4d9b' },
    { bg: '#fffac8', fg: '#7a6800' },
  ];

  cardBg(name: string): string {
    return this.palette[name.charCodeAt(0) % this.palette.length].bg;
  }

  cardFg(name: string): string {
    return this.palette[name.charCodeAt(0) % this.palette.length].fg;
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
    }
    // cart logic goes here
  }

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productsService
      .getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (products) => this.products.set(products),
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message ?? error?.error?.error ?? 'Impossible de charger les produits.',
          );
        },
      });
  }
}
