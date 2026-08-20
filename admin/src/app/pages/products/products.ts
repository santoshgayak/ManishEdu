import { Component } from '@angular/core';
import { ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Product } from '../../model/products.model';
import { NgClass, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Loader } from '../../components/loader/loader';
import { Order } from '../../model/order.model';

@Component({
  selector: 'app-products',
  imports: [NgClass, NgFor, RouterLink, Loader],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  orderList: Order[] = [];
  sarangiRevenue = 0;
  bansuriRevenue = 0;
  madalRevenue = 0;
  totalRevenue = 0;

  productList: Product[] = [];
  constructor() {}

  ngOnInit() {
    this.dataService.getData('product', 'products').subscribe({
      next: (res) => {
        this.productList = res.data;
        this.cdr.detectChanges();
      },
    });
    this.dataService.getData('order', 'orders').subscribe({
      next: (res) => {
        this.orderList = res.data;
        // Calculate totals of all data
        this.sarangiRevenue = this.orderList
          .filter((order) => order.type === 'Product' && order.itemName === 'Classic Sarangi')
          .reduce((sum, order) => sum + order.totalPrice, 0);

        this.madalRevenue = this.orderList
          .filter((order) => order.type === 'Product' && order.itemName === 'Professional Madal')
          .reduce((sum, order) => sum + order.totalPrice, 0);

        this.bansuriRevenue = this.orderList
          .filter((order) => order.type === 'Product' && order.itemName === 'Premium Bansuri')
          .reduce((sum, order) => sum + order.totalPrice, 0);

        this.totalRevenue = this.bansuriRevenue + this.sarangiRevenue + this.madalRevenue;
        this.cdr.detectChanges();
      },
    });
  }

  addNewProduct() {
    this.router.navigate(['/dashboard/add-product']);
  }

  //delete product
  deleteProduct(productId: string) {
    this.dataService.deleteProduct(productId).subscribe({
      next: (response) => {
        this.productList = this.productList.filter((item) => item._id !== productId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('An error occurred during deletion of product:', err);
      },
    });
  }
  editProduct(productId: string) {
    this.router.navigate(['dashboard/edit-product', productId]);
  }
}
