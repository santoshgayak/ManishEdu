import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
// Make sure to import the directive for the template, not just the type
import { FormField } from '@angular/forms/signals'; 
import { RouterLink, Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormField, RouterLink], // <-- Use the directive here
  templateUrl: './login.html',
  styleUrl: './login.scss',
})



export class Login {
    constructor(
      private router: Router,
      private authenticateService:AuthenticateService
    ){}

    signIn = signal({
      email:'',
      password: '',
      checkbox: false
    });

    signInForm = form(this.signIn);
    onSubmit(event: Event){

      if(event){
        event.preventDefault();
      }
      const payload = this.signIn();

      this.authenticateService.authenticate(payload).subscribe({
        next:(res)=>{
            console.log("Authentication successful ! fc",res.token);
            localStorage.setItem('token',res.token);
            this.router.navigate(['/dashboard']);
        },
        error: (err)=>{
          console.error('login failed',err);
          
        }
      });
    }

}
