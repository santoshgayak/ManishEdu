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
  constructor() {}
  ngOnInit() {
    this.loadClasses();
    this.cdr.detectChanges();
  }

  private loadClasses(): void {
    this.dataService.getData('class', 'courses').subscribe({
      next: (res: any) => {
        this.classList = res.data;
        console.log('Classes loaded successfully:', this.classList);
      },
      error: (err) => {
        console.error('Failed to load classes:', err);
      },
    });
  }
  navigate() {
    this.router.navigate(['/dashboard/classes']);
  }
  editClass(classId: string) {
    this.router.navigate(['/dashboard/edit-class', classId]);
  }
  deleteClass(classId: string) {
    console.log('Delete button clicked in UI for ID:', classId);

    // CRITICAL: You must use .subscribe() here to trigger the network request!
    this.dataService.deleteClass(classId).subscribe({
      next: (response) => {
        console.log('Backend responded successfully:', response);

        // Optional: Remove the deleted class from your local array to update the UI instantly
        this.classList = this.classList.filter((item) => item._id !== classId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('An error occurred during deletion:', err);
      },
    });
  }
}
