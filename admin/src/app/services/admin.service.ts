import { Injectable } from '@angular/core';
import { Admin } from '../model/admin.model';
import { BehaviorSubject, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private userSubject = new BehaviorSubject<Admin | null>(null);

  admin$ = this.userSubject.asObservable();
  constructor() {
    this.loadAdmin();
  }

  setAdmin(admin: Admin) {
    console.log('ADMIN SERVICE UPDATED:', admin);
    this.userSubject.next(admin);
  }
  loadAdmin() {
    const storedAdmin = localStorage.getItem('user');
    if (!storedAdmin || storedAdmin === 'undefined') {
      return;
    }
    try {
      const admin: Admin = JSON.parse(storedAdmin);
      this.userSubject.next(admin);
    } catch (error) {
      console.error('Invalid admin in localStorage:', error);
    }
  }
}
