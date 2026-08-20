import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { Order } from '../../model/order.model';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private dataService = inject(DataService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  public orderList: Order[] = [];
  menuOpen = false;
  user: any;

  constructor() {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('USER: ', this.user);

    this.dataService.getData('order', 'orders').subscribe({
      next: (res: Order[]) => {
        this.orderList = (res as any).data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to handle orders stream in component:', err);
      },
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
