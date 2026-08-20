import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { BehaviorSubject } from 'rxjs';
import { CartService } from './cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private stripePromise = loadStripe(
    'pk_test_51TeF6UGxMgU0T7HjNb58MXqBmdK0nUY4LBfrW2FM5uQAZfJbpZbPgrt0zvzATqdOxJcLOJnXB843PZgjcdisqE1400tL98zn97',
  );
  private stripe!: Stripe | null;
  private checkoutMounted = false;

  constructor(
    private router: Router,
    private cartService: CartService,
  ) {}
  ngOnInit() {
    this.cartService.cart$.subscribe((items) => {
      console.log(' CART AT CHECKOUT SERVICE: ', items);
    });
  }
  async proceedToPayment(customerId: any) {
    this.stripe = await this.stripePromise;
    if (!this.stripe) {
      console.error('Stripe failed to load...');
      return;
    }

    //prevent multiple mount
    if (this.checkoutMounted) return;
    this.checkoutMounted = true;
    try {
      console.log('Initializing Embedded Checkout...');
      console.log(this.cartService.getCartValue());

      const checkout = await (this.stripe as any).createEmbeddedCheckoutPage({
        fetchClientSecret: async () => {
          const res = await fetch('https://manisheduserver.onrender.com/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: this.cartService.getCartValue(),
              customerId: customerId,
            }),
          });

          const data = await res.json();
          console.log('Client secret:', data);
          return data.clientSecret;
        },
      });
      console.log('Mounting checkout...');
      checkout.mount('#checkout');
      console.log('Checkout successfully mounted!');
    } catch (err) {
      console.error('Error setting up Embedded Checkout:', err);
      this.checkoutMounted = false;
    }
  }
}
