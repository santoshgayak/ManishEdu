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
  private cdr = inject(ChangeDetectorRef);
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
      this.loadClasses();
    }

    const savedOrders = localStorage.getItem('orders');

    if (savedOrders) {
      this.orderList = JSON.parse(savedOrders);
      this.calculateTotals();
    } else {
      this.loadOrders();
    }
  }
  calculateTotals() {
    console.log('Here is are the orderlList', this.orderList);
    this.cdr.detectChanges();
    this.orderList.forEach((order) => {
      if (order.type !== 'Class') return;

      const price = Number(order.items[0].totalPrice);
      switch (order.items[0].itemName) {
        case 'Basic Sarangi Class':
          this.basic_sarangi_revenue += price;
          console.log(this.basic_sarangi_revenue);
          break;

        case 'Intermediate Sarangi Skills':
          this.intermediate_sarangi_revenue += price;
          console.log(this.intermediate_sarangi_revenue);
          break;

        case 'Advanced Sarangi Mastery':
          this.advance_sarangi_revenue += price;
          console.log(this.advance_sarangi_revenue);

          break;
      }
    });
    this.total_revenue =
      this.basic_sarangi_revenue + this.intermediate_sarangi_revenue + this.advance_sarangi_revenue;
    this.cdr.detectChanges();
  }
  loadClasses() {
    this.dataService.getData('class', 'courses').subscribe({
      next: (res) => {
        this.classList = res.data;
      },
      error: (err) => {
        console.error('Failed to load classes:', err);
      },
    });
  }
  loadOrders() {
    this.dataService.getData('order', 'orders').subscribe({
      next: (res) => {
        this.orderList = res.data;
        this.calculateTotals();
      },
    });
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('An error occurred during deletion:', err);
      },
    });
  }
}
