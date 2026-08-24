import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Admin } from '../../model/admin.model';
import { AdminService } from '../../services/admin.service';
import { ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';

import { disabled, required, validate } from '@angular/forms/signals';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule, NgClass, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  isEditable = false;

  fb = new FormBuilder();
  AdminInfo: any;
  isOn: boolean = false;
  preferenceOn = false;
  emailNotification = false;
  phoneNotification = false;
  transactionNotification = false;
  showPasswordChangeForm = false;
  user: any;

  passwordChangeForm = this.fb.group({
    password: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  adminService = inject(AdminService);
  dataService = new DataService();
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.user = localStorage.getItem('user');

    if (this.user) {
      this.user = JSON.parse(this.user);
    } else {
      this.loadUser();
    }

    this.AdminInfo = this.fb.group({
      fName: [{ value: this.user?.fName || '', disabled: true }, Validators.required],
      lName: [{ value: this.user?.lName || '', disabled: true }, Validators.required],
      email: [{ value: this.user?.email || '', disabled: true }, Validators.required],
      pNumber: [{ value: this.user?.pNumber || '', disabled: true }, Validators.required],
      role: [{ value: this.user?.role || '', disabled: true }, Validators.required],
    });
    this.emailNotification = this.user.notificationPreference.isEmailOn;
    this.phoneNotification = this.user.notificationPreference.isPhoneOn;
    this.transactionNotification = this.user.notificationPreference.isTransactionOn;
  }

  loadUser() {
    this.dataService.getData('admin', 'admins').subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  editProfile() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.AdminInfo.enable();
    } else {
      this.AdminInfo.disable();
    }
  }

  turnOnPreference() {}
  toggle(type: 'email' | 'phone' | 'transaction') {
    switch (type) {
      case 'email':
        this.emailNotification = !this.emailNotification;
        break;
      case 'phone':
        this.phoneNotification = !this.phoneNotification;
        break;
      case 'transaction':
        this.transactionNotification = !this.transactionNotification;
        break;
    }
  }

  changePassword() {
    this.showPasswordChangeForm = !this.showPasswordChangeForm;
  }

  onSubmit() {
    if (this.AdminInfo.invalid) {
      this.AdminInfo.markAllAsTouched();
      return;
    }
    const updatedFields: Partial<Admin> = {};

    Object.keys(this.AdminInfo.controls).forEach((key) => {
      const control = this.AdminInfo.get(key);
      if (control?.dirty) {
        updatedFields[key as keyof Admin] = control.value;
      }
    });
    console.log('Changed fields : ', updatedFields);
    this.dataService.updateAmin('admins', this.user._id, updatedFields).subscribe({
      next: (res) => {
        const admin = res.admin;
        this.user = admin;
        localStorage.setItem('user', JSON.stringify(admin));
        this.adminService.setAdmin(admin);
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });
  }
}
