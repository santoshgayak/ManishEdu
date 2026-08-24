import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Admin } from '../../model/admin.model';
import { AdminService } from '../../services/admin.service';
import { ChangeDetectorRef } from '@angular/core';
import { PasswordService } from '../../services/password.service';
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
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/),
      ],
    ],
    confirmPassword: ['', Validators.required],
  });

  isComplete = false;
  adminService = inject(AdminService);
  dataService = new DataService();
  passwordService = inject(PasswordService);

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
    if (!this.showPasswordChangeForm) {
      this.showPasswordChangeForm = true;
      return;
    }
    if (this.passwordChangeForm.invalid) {
      this.passwordChangeForm.markAllAsTouched();
      alert('Password must be atleast 10 characters long and shoudl contain symbols');
      return;
    }
    if (
      this.passwordChangeForm.value.newPassword !== this.passwordChangeForm.value.confirmPassword
    ) {
      alert('New Passwords donot match.');
      return;
    }
    console.log('Password change form is valid', this.passwordChangeForm.value);

    const { password, newPassword, confirmPassword } = this.passwordChangeForm.getRawValue();

    if (!password || !newPassword || !confirmPassword) {
      alert('Please complete all fields.');
      return;
    }

    this.passwordService.changePassword(this.user._id, password, newPassword).subscribe({
      next: () => {
        console.log('Password updated successfully');

        this.passwordChangeForm.reset();
        this.showPasswordChangeForm = false;
      },
      error: (err) => {
        console.error('Password update failed:', err);
        alert('Password could not be updated.');
      },
    });

    this.showPasswordChangeForm = false;
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
