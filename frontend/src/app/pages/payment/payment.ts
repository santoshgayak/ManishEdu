import { Component, inject } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { CustomerInfo } from '../../models/customerInfo/customerInfo.model';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutService } from '../../services/checkout.service';
import { ChangeDetectorRef } from '@angular/core';
import { StripeCheckoutService } from '../../services/stripeCheckout.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule, Footer],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  classId = '';
  studentId = '';
  customerId = '';

  payload = {
    id: this.classId,
  };

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private stripeCheckoutService: StripeCheckoutService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('classId') || '';
    this.route.queryParams.subscribe((params) => {
      const flow = params['flow'];
      if (flow === 'product') {
        this.customerId = params['customerId'];
      }

      if (flow === 'class') {
        this.classId = params['classId'];
        this.studentId = params['studentId'];
      }
    });
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => {
      if (this.classId) {
        this.stripeCheckoutService.proceedToPayment(this.classId, this.studentId);
      } else {
        this.checkoutService.proceedToPayment(this.customerId);
      }
    });
  }
}
