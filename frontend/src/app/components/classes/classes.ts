import { Component, ChangeDetectorRef } from '@angular/core';
import { ClassPlan } from '../../models/classes/classes.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  success: boolean;
  data: ClassPlan[];
}

@Component({
  selector: 'app-classes',
  standalone: true, // 🌟 CRITICAL FIX: Tells Angular to look at the imports array below
  imports: [CommonModule],
  templateUrl: './classes.html',
  styleUrl: './classes.css',
})
export class Classes {
  classList: ClassPlan[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // 🌟 Injecting change tracker just in case
  ) {
    this.http.get<ApiResponse>('https://manisheduserver.onrender.com/api/data/courses').subscribe({
      next: (res) => {
        console.log('Data successfully arrived:', res.data);

        this.classList = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
      },
    });
  }

  enrollInClass(id: string) {
    this.router.navigate(['/enroll', id]);
  }
}
