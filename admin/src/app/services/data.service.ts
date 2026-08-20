import { catchError, Observable, of } from 'rxjs';
import { Order } from '../model/order.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ClassPlan } from '../model/classes.model';
import { Product } from '../model/products.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //apiUrl = 'http://localhost:3000/api';
  apiUrl = 'https://manisheduserver.onrender.com/api';
  private http = inject(HttpClient);
  updatedClass?: ClassPlan;
  updatedProduct?: Product;

  constructor() {}

  getData(pathname: string, collection: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/data/${pathname}/${collection}`).pipe(
      catchError((err) => {
        console.error('API failed:', err);
        return of({ success: false, data: [] });
      }),
    );
  }
  saveClass(pathname: string, collection: string, updatedClass: ClassPlan) {
    console.log(' Beofre API', updatedClass);
    return this.http.post<any>(`${this.apiUrl}/save/class`, updatedClass).pipe(
      catchError((err) => {
        console.error('API failed:', err);
        return of({ success: false, data: null, error: err.message });
      }),
    );
  }
  deleteClass(id: string) {
    console.log(' In delete service');
    return this.http.post<any>(`${this.apiUrl}/delete/class`, { id }).pipe(
      catchError((err) => {
        console.error('Deleting API failed:', err);
        return of({ success: false, data: null, error: err.message });
      }),
    );
  }
  saveProduct(pathname: string, collection: string, updatedClass: Product) {
    console.log(' Beofre API', updatedClass);
    return this.http.post<any>(`${this.apiUrl}/save/product`, updatedClass).pipe(
      catchError((err) => {
        console.error('API failed:', err);
        return of({ success: false, data: null, error: err.message });
      }),
    );
  }
  deleteProduct(id: string) {
    console.log(' In delete service');
    return this.http.post<any>(`${this.apiUrl}/delete/product`, { id }).pipe(
      catchError((err) => {
        console.error('Deleting product API failed:', err);
        return of({ success: false, data: null, error: err.message });
      }),
    );
  }
}
