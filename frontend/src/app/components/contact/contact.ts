import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private http = inject(HttpClient);
 private formBuilder = inject(FormBuilder);
 contactForm = this.formBuilder.group({
  name:[''],
  email:[''],
  subject:['',],
  message:['']
 })
  constructor (private router: Router){

  }

 


  onSubmit(){
    console.log(this.contactForm.value);

    const formData = this.contactForm.value;
    this.http.post('http://localhost:3000/api/contact', formData)
        .subscribe({
          next: (response) =>{
            console.log("Success", response);
            this.contactForm.reset();
            this.router.navigate(['/contact-form-submission-confirmation']);
          },
          error: (error)=>{
            console.error('Error:',error);
          }
          
        });
  }
}
