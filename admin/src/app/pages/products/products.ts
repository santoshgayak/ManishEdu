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
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      this.productList = JSON.parse(savedProducts);
    }
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orderList = JSON.parse(savedOrders);
      for (const order of this.orderList) {
        if (order.type === 'Product' && order.paymentStatus === 'Paid') {
          for (const item of order.items) {
            const itemName = item.itemName.toLowerCase();

            if (itemName.includes('sarangi')) {
              this.sarangiRevenue += item.totalPrice;
            } else if (itemName.includes('madal')) {
              this.madalRevenue += item.totalPrice;
            } else if (itemName.includes('bansuri')) {
              this.bansuriRevenue += item.totalPrice;
            }
          }
        }
      }
      this.totalRevenue = this.sarangiRevenue + this.madalRevenue + this.bansuriRevenue;
      this.cdr.detectChanges();
    } else {
      this.dataService.getData('order', 'orders').subscribe({
        next: (res) => {
          this.orderList = res.data;
          // Calculate totals of all data
          for (const order of this.orderList) {
            if (order.type === 'Product' && order.paymentStatus === 'Paid') {
              for (const item of order.items) {
                if (item.itemName.toLowerCase().includes('sarangi')) {
                  console.log('This is a Sarangi item');
                  this.sarangiRevenue += item.totalPrice;
                }
                if (item.itemName.toLowerCase().includes('madal')) {
                  console.log('This is a Sarangi item');
                  this.madalRevenue += item.totalPrice;
                }
                if (item.itemName.toLowerCase().includes('bansuri')) {
                  console.log('This is a Sarangi item');
                  this.bansuriRevenue += item.totalPrice;
                }
              }
            }
          }
          this.totalRevenue = this.bansuriRevenue + this.sarangiRevenue + this.madalRevenue;
          this.cdr.detectChanges();
        },
      });
    }
    this.loadProducts();
  }

  loadProducts() {
    this.dataService.getData('product', 'products').subscribe({
      next: (res) => {
        this.productList = res.data;
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
