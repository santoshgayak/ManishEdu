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
    this.dataService.getData('order', 'orders').subscribe({
      next: (res) => {
        this.orderList = res.data;
        // Calculate totals of all data
        this.enrollment_total = this.orderList
          .filter((order) => order.type === 'Class')
          .reduce((sum, order) => sum + order.totalPrice, 0);

        this.student_total = this.orderList
          .filter((order) => order.type === 'Class')
          .reduce((sum, order) => sum + 1, 0);

        this.order_total = this.orderList
          .filter((order) => order.type === 'Product')
          .reduce((sum, order) => sum + order.totalPrice, 0);

        this.total_revenue = this.enrollment_total + this.order_total;
        this.cdr.detectChanges();
      },
    });
  }
}
