import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { Product } from '../../../../core/products/product.models';
import { ProductsService } from '../../../../core/products/products.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, NavbarComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);

  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly displayInitial = computed(() => this.product()?.name.charAt(0).toUpperCase() ?? '');

// Quantité sélectionnée
  qty = 1;

  increaseQty() { this.qty++; }
  decreaseQty() { if (this.qty > 1) this.qty--; }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    // cart logic goes here
  }

  buyNow() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    // checkout logic goes here
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Produit introuvable.');
      this.isLoading.set(false);
      return;
    }

    this.productsService
      .getProductById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (product) => this.product.set(product),
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message ?? error?.error?.error ?? 'Impossible de charger ce produit.',
          );
        },
      });
  }
}
