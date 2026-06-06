import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';  
import { BuyNow } from './pages/buy-now/buy-now';
import { ContactFormSubmissionConfirmation } from './pages/contact-form-submission-confirmation/contact-form-submission-confirmation';
import { Payment } from './pages/payment/payment';

export const routes: Routes = [
    {
        path: '',
        component: Home

    },
    {
        path: 'shop',
        component: Shop
    },
    {
        path:'buy-now',
        component: BuyNow
    },
    {
        path:'contact-form-submission-confirmation',
        component: ContactFormSubmissionConfirmation
    },
    {
        path:'payment',
        component: Payment

    }
];
