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
    this.contactForm.reset();
    this.router.navigate(['/contact-form-submission-confirmation']);
  }
}
