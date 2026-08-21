import { Component } from '@angular/core';
import { ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as echarts from 'echarts';

import { DataService } from '../../services/data.service';
import { Order } from '../../model/order.model';
import { Loader } from '../../components/loader/loader';
@Component({
  selector: 'app-order',
  imports: [DatePipe, NgClass, RouterLink, Loader],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Orders {
  orderList: Order[] = [];
  total_revenue = 0;
  enrollment_total = 0;
  student_total = 0;
  order_total = 0;

  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const savedOrders = localStorage.getItem('orders');

    if (savedOrders) {
      this.orderList = JSON.parse(savedOrders);
      this.calculateTotals();
    } else {
      this.dataService.getData('order', 'orders').subscribe({
        next: (res) => {
          this.orderList = res.data;

          // Cache orders
          localStorage.setItem('orders', JSON.stringify(this.orderList));

          this.calculateTotals();
        },
        error: (err) => {
          console.error('Failed to load orders:', err);
        },
      });
    }
  }
  calculateTotals() {
    this.student_total = 0;
    this.enrollment_total = 0;
    this.order_total = 0;

    for (const order of this.orderList) {
      if (order.paymentStatus !== 'Paid') {
        continue;
      }

      if (order.type === 'Class') {
        this.student_total++;

        for (const item of order.items) {
          this.enrollment_total += item.totalPrice;
        }
      }

      if (order.type === 'Product') {
        for (const item of order.items) {
          this.order_total += item.totalPrice;
        }
      }
    }

    this.total_revenue = this.enrollment_total + this.order_total;

    this.cdr.detectChanges();
  }
}
