import { Component, inject } from '@angular/core';
import { Product } from '../../model/products.model';
import { DataService } from '../../services/data.service';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-manage-products',
  imports: [RouterLink, Loader],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.scss',
})
export class ManageProducts {
  productList: Product[] = [];

  private dataService = inject(DataService);
  private router = inject(Router);

  ngOnInit(): void {
    // 1. Load cached products first
    const savedProducts = localStorage.getItem('products');

    if (savedProducts) {
      this.productList = JSON.parse(savedProducts);
    }

    // 2. Get fresh products from API
    this.loadProducts();
  }

  private loadProducts(): void {
    this.dataService.getData('product', 'products').subscribe({
      next: (res: any) => {
        // 3. Update UI with fresh data
        this.productList = res.data;

        // 4. Update localStorage
        localStorage.setItem('products', JSON.stringify(this.productList));

        console.log('Products loaded successfully:', this.productList);
      },

      error: (err) => {
        console.error('Failed to load products:', err);

        // Cached products remain displayed if API fails
      },
    });
  }

  navigate(): void {
    this.router.navigate(['/dashboard/products']);
  }

  editProduct(productId: string): void {
    this.router.navigate(['/dashboard/edit-product', productId]);
  }

  deleteProduct(productId: string): void {
    console.log('Delete button clicked in UI for ID:', productId);

    this.dataService.deleteProduct(productId).subscribe({
      next: (response) => {
        console.log('Backend responded successfully:', response);

        // Remove from UI
        this.productList = this.productList.filter((item) => item._id !== productId);

        // IMPORTANT: update localStorage
        localStorage.setItem('products', JSON.stringify(this.productList));
      },

      error: (err) => {
        console.error('An error occurred during deletion of product:', err);
      },
    });
  }
}
