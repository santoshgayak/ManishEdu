import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { Order } from '../../model/order.model';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Route } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Admin } from '../../model/admin.model';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, AsyncPipe, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private dataService = inject(DataService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  admin$ = this.adminService.admin$;

  public orderList: Order[] = [];
  menuOpen = false;

  constructor() {}

  ngOnInit() {
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
