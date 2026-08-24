import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  http = inject(HttpClient);
  apiUrl = 'https://manisheduserver.onrender.com/api';
  apiUrl2 = 'http://localhost:3000/api';

  changePassword(id: string, oldPassword: string, newPassword: string) {
    console.log('In service: ', id + ' -- ', oldPassword, '---', newPassword);
    return this.http.patch(`${this.apiUrl2}/change-password`, {
      id,
      oldPassword,
      newPassword,
    });
  }
}
