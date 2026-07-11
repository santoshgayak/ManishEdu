import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { DataService } from '../../services/data.service';
import { ClassPlan } from '../../model/classes.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-upadate-success',
  imports: [NgIf, RouterLink],
  templateUrl: './upadate-success.html',
  styleUrl: './upadate-success.scss',
})
export class UpadateSuccess {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  showToast = false;
  showDeleteToast=false;


  classList: ClassPlan[]=[];
  filteredClass?:ClassPlan | null = null;
  classForm = this.fb.group({
    className: [''],
    image: [''],
    level: [''],
    status: [''],
    price: [0],
    duration: [''],
    description: [''],
    feature1: [''],
    feature2: [''],
    feature3: [''],
    feature4: [''],
    feature5: ['']
  });
  constructor(){

  }
  ngOnInit(){
    this.getEditingClassData();
    
  }

  getEditingClassData(){
    const id = this.route.snapshot.paramMap.get('classId');
    console.log("this is id in udate recieved",id);
    this.dataService.getData('class','courses').subscribe({
      next:(res)=>{
        this.classList = res.data;
        console.log("this is update-class:",this.classList)
         this.filteredClass = this.classList.find(
          item => item._id === id )
          console.log("fc",this.filteredClass);
          if(this.filteredClass){
              this.showToast=true;

          }
          this.cdr.detectChanges();
        }
    })

  }




   editClass(classId: string) {
      console.log('Edit class with ID:', classId);
      this.router.navigate(['/dashboard/edit-class',classId])
    }


    deleteClass(classId:string){
      console.log("Delete button clicked in UI for ID:", classId);

      this.dataService.deleteClass(classId).subscribe({
        next: (response) => {
          console.log("Backend responded successfully:", response);
          
          this.classList = this.classList.filter(item => item._id !== classId);
          this.filteredClass = null;
          this.showDeleteToast=true;
          this.showToast=false;
          this.cdr.detectChanges();
          setTimeout(()=>{
                      this.router.navigate(['/dashboard/classes']);

          },2000);

        },
        error: (err) => {
          console.error("An error occurred during deletion:", err);
        }
    });
  }



closeToast() {
  this.showToast = false;
}
}
