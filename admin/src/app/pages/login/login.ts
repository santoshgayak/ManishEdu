import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
// Make sure to import the directive for the template, not just the type
import { FormField } from '@angular/forms/signals';
import { RouterLink, Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { AdminService } from '../../services/admin.service';
import { inject } from '@angular/core';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormField, RouterLink], // <-- Use the directive here
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private adminService = inject(AdminService);

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService,
  ) {}

  signIn = signal({
    email: 'santoshgayak10@gmail.com',
    password: 'Pokharanepal@38',
    checkbox: false,
  });

  signInForm = form(this.signIn);
  onSubmit(event: Event) {
    if (event) {
      event.preventDefault();
    }
    const payload = this.signIn();

    this.authenticateService.authenticate(payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.adminService.setAdmin(res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('login failed', err);
      },
    });
  }
}
