import { ChangeDetectorRef, Component } from '@angular/core';
import { ClassPlan } from '../../model/classes.model';
import { DataService } from '../../services/data.service';
import { inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-manage-classes',
  imports: [RouterLink, RouterOutlet, Loader],
  templateUrl: './manage-classes.html',
  styleUrl: './manage-classes.scss',
})
export class ManageClasses {
  classList: ClassPlan[] = [];

  private dataService = inject(DataService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // 1. Load cached data immediately
    const savedClasses = localStorage.getItem('classes');

    if (savedClasses) {
      this.classList = JSON.parse(savedClasses);
    }

    // 2. Get fresh data from backend
    this.loadClasses();
  }

  private loadClasses(): void {
    this.dataService.getData('class', 'courses').subscribe({
      next: (res: any) => {
        // 3. Update UI with fresh data
        this.classList = res.data;

        // 4. Update localStorage
        localStorage.setItem('classes', JSON.stringify(this.classList));

        console.log('Classes loaded successfully:', this.classList);
      },

      error: (err) => {
        console.error('Failed to load classes:', err);

        // Keep cached classes if API fails
      },
    });
  }

  navigate(): void {
    this.router.navigate(['/dashboard/classes']);
  }

  editClass(classId: string): void {
    this.router.navigate(['/dashboard/edit-class', classId]);
  }

  deleteClass(classId: string): void {
    console.log('Delete button clicked in UI for ID:', classId);

    this.dataService.deleteClass(classId).subscribe({
      next: (response) => {
        console.log('Backend responded successfully:', response);

        // Remove from UI
        this.classList = this.classList.filter((item) => item._id !== classId);

        // IMPORTANT: update localStorage too
        localStorage.setItem('classes', JSON.stringify(this.classList));

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('An error occurred during deletion:', err);
      },
    });
  }
}
