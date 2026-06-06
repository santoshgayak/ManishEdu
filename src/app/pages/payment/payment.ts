import { Component, inject } from '@angular/core';
import { Footer } from "../../components/footer/footer";
import { FormGroup , FormBuilder} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule,Footer],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {

  constructor(private router: Router){

  }
  private formBuilder = inject(FormBuilder);
  paymentInfo = this.formBuilder.group({
    firstName:[''],
    lastName:[''],
    phone:[''],
    email:[''],
    address:this.formBuilder.group({
      addressLine1:[''],
      addressLine2:[''],
      city:[''],
      state:[''],
      postcode:[''],
      country:['']
    }),
    card:this.formBuilder.group({
    cardName:[''],
      cardNumber:[''],
      expiry:[''],
      cvv:['']
    })
 
  });


  proceedToPayment(){
    console.log("Payment processing now.");
    console.log(this.paymentInfo.value);
    this.router.navigate(['/']);

  }
}
