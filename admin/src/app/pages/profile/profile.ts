import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  constructor() {}
  ngOnInit() {
    this.user = localStorage.getItem('user');

    if (this.user) {
      this.user = JSON.parse(this.user);
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
}
