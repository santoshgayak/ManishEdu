import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { ReactiveFormsModule } from '@angular/forms';

import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../../services/checkout.service';
@Component({
  selector: 'app-customer-info',
  imports: [ReactiveFormsModule,Footer],
  templateUrl: './customer-info.html',
  styleUrl: './customer-info.css',
})
export class CustomerInfo {

  constructor(private router: Router, 
              private http: HttpClient,
              private checkoutService: CheckoutService
              ) {}

  
  private fb = inject(FormBuilder);

  //paymentInfo form structure
  paymentInfo = this.fb.group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    email: [''],
    address: this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      postcode: [''],
      country: ['']
    })
  });

  proceedToPayment(){
    this.savedFormData();
  } 

  //save form data and navigate to payment page
  savedFormData(){
    const formData = this.paymentInfo.value;
    console.log(" fomr dat:",formData);
    this.http.post('http://localhost:3000/api/save-customer-info',formData).
    subscribe({
      next:(res)=>{
        this.router.navigate(['/payment']);
      },
      error:(err)=>{
          console.error("Error saving data:", err);
      }
    })

  }
}

  
