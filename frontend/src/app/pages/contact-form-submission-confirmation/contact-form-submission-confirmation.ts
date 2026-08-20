import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form-submission-confirmation',
  imports: [Navbar, Footer],
  templateUrl: './contact-form-submission-confirmation.html',
  styleUrl: './contact-form-submission-confirmation.css',
})
export class ContactFormSubmissionConfirmation {
  constructor(private router: Router) {}

  //route to home
  goHome() {
    this.router.navigate(['/']);
  }

  //route to FAQ section
  goFAQ() {
    this.router.navigate(['/'], { fragment: 'faq-section' });
  }
}
