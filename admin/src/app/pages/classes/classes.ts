import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ClassPlan } from '../../model/classes.model';
import { ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManageClasses } from '../../components/manage-classes/manage-classes';
import { NgClass, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../model/order.model';
import { Loader } from '../../components/loader/loader';

@Component({
  selector: 'app-classes',
  imports: [ManageClasses, RouterLink, NgClass, NgFor, RouterLink, Loader],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes {
  private dataService = inject(DataService);
  private router = inject(Router);

  public basic_sarangi_revenue = 0;
  public intermediate_sarangi_revenue = 0;
  public advance_sarangi_revenue = 0;
  public total_revenue = 0;

  classList: ClassPlan[] = [];
  orderList: Order[] = [];

  showToast = false;
  showDeleteToast = false;
  constructor() {}

  ngOnInit() {
    const savedClasses = localStorage.getItem('classes');

    if (savedClasses) {
      this.classList = JSON.parse(savedClasses);
    } else {
      this.loadClass();
    }
    this.getTotal();
  }
  getTotal() {
    const savedOrders = localStorage.getItem('orders');

    if (savedOrders) {
      this.orderList = JSON.parse(savedOrders);
      this.calculateRevenue();
    } else {
      this.dataService.getData('order', 'orders').subscribe({
        next: (res) => {
          this.orderList = res.data;
          this.calculateRevenue();
        },
        error: (err) => {
          console.error('Failed to load orders:', err);
        },
      });
    }
  }

  loadClass() {
    this.dataService.getData('class', 'courses').subscribe({
      next: (res) => {
        this.classList = res.data;
      },
    });
  }

  calculateRevenue() {
    this.basic_sarangi_revenue = 0;
    this.intermediate_sarangi_revenue = 0;
    this.advance_sarangi_revenue = 0;

    this.orderList.forEach((order) => {
      if (order.type !== 'Class' || order.paymentStatus !== 'Paid') {
        return;
      }

      const item = order.items?.[0];

      if (!item) {
        return;
      }

      const price = Number(item.totalPrice);

      switch (item.itemName) {
        case 'Basic Sarangi Class':
          this.basic_sarangi_revenue += price;
          break;

        case 'Intermediate Sarangi Skills':
          this.intermediate_sarangi_revenue += price;
          break;

        case 'Advanced Sarangi Mastery':
          this.advance_sarangi_revenue += price;
          break;
      }
    });

    this.total_revenue =
      this.basic_sarangi_revenue + this.intermediate_sarangi_revenue + this.advance_sarangi_revenue;
  }
  editClass(classId: string) {
    console.log('Edit class with ID:', classId);
    this.router.navigate(['/dashboard/edit-class', classId]);
  }
  addNewClass() {
    console.log('Clicleddð');
    this.router.navigate(['/dashboard/add-class']);
  }
  deleteClass(classId: string) {
    console.log('Delete button clicked in UI for ID:', classId);

    this.dataService.deleteClass(classId).subscribe({
      next: (response) => {
        console.log('Backend responded successfully:', response);

        this.classList = this.classList.filter((item) => item._id !== classId);
      },
      error: (err) => {
        console.error('An error occurred during deletion:', err);
      },
    });
  }
}
