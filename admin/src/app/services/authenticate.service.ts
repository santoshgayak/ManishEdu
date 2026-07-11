import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

import { loginData } from "../model/loginData.model";
import { LoginResponse } from "../model/loginResponse.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  authenticate(data: loginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`,data)
    .pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify( res.user));
      })
    );
  }
}