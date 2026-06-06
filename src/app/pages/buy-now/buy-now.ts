import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-buy-now',
  imports: [ReactiveFormsModule, Footer],
  templateUrl: './buy-now.html',
  styleUrl: './buy-now.css',
})
export class BuyNow {
  constructor(private router : Router){

  }
  private formBuilder = inject(FormBuilder);
  checkoutForm = this.formBuilder.group({
    firstName:[''],
    lastName:[''],
    phone:[''],
    email:[''],
    address:this.formBuilder.group({
      addressLine1: [''],
      addressLine2:[''],
      city:[''],
      state:[''],
      postcode:[''],
      country:['']
    })

  })
  onSubmit(){
    console.log(this.checkoutForm.value);
    this.checkoutForm.reset();
    this.router.navigate(['/contact-form-submission-confirmation']);
  }
  proceedToPayment(){
    this.router.navigate(['/payment']);
  }

}
