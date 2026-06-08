import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Product } from '../../core/products/product.models';
import { ProductsService } from '../../core/products/products.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CurrencyPipe, RouterLink, NavbarComponent],
})
export class HomeComponent {
  private readonly productsService = inject(ProductsService);

  readonly isLoading = signal(true);
  readonly latest = signal<Product[]>([]);

  constructor() {
    this.productsService
      .getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (products) => {
          const sorted = [...products].sort((a, b) => {
            return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
          });
          this.latest.set(sorted.slice(0, 10));
        },
      });
  }

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
}
