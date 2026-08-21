import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { scheduled, timeInterval } from 'rxjs';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface SaveStudentResponse {
  success: boolean;
  message: string;
  data: {
    alreadyExists: boolean;
    data: {
      _id: string;
      success: boolean;
    };
  };
}

@Component({
  selector: 'app-enroll',
  imports: [Footer, ReactiveFormsModule],
  templateUrl: './enroll.html',
  styleUrl: './enroll.css',
})
export class Enroll {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  classId: string = '';

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('classId') || '';
    console.log('This is class id received in enroll:', this.classId);
  }
  private fb = inject(FormBuilder);

  //form structure
  enrollmentInfo = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],

    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],

    address: this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['', Validators.required],
    }),

    course: ['', Validators.required],
    preferredTime: ['', Validators.required],
    classLevel: ['', Validators.required],
    learnedMusic: ['', Validators.required],
    survey: ['', Validators.required],

    comment: [''],
    terms: [false, Validators.requiredTrue],
  });

  //save student form data and navigate to payment
  proceedToPayment() {
    this.enrollmentInfo.markAllAsTouched();
    if (this.enrollmentInfo.invalid) {
      console.log('Form is invalid.');
      return;
    }
    console.log('Forms submmited', this.enrollmentInfo.value);
    this.http
      .post<SaveStudentResponse>(
        'https://manisheduserver.onrender.com/api/save-student-info',
        this.enrollmentInfo.value,
      )
      .subscribe({
        next: (res) => {
          console.log('Saved student information succesfully', res);
          console.log('✅ API success:', res);

          const studentId = res.data.data._id;
          console.log(' STUDENT IN AFTER SAVING :::', studentId);
          this.router.navigate(['/payment'], {
            queryParams: {
              flow: 'class',
              classId: this.classId,
              studentId: studentId,
            },
          });
        },
        error: (err) => {
          console.log('error saving student data.', err);
        },
      });
  }
}
