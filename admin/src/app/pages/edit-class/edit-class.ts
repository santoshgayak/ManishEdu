import { Component } from '@angular/core';
import { ClassPlan } from '../../model/classes.model';
import { DataService } from '../../services/data.service';
import { inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-class',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-class.html',
  styleUrl: './edit-class.scss',
})
export class EditClass {

  classList: ClassPlan[] = [];
  filteredClass?: ClassPlan | null = null;

  private dataService = inject(DataService)
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  

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
    this.dataService.getData('class','courses').subscribe({
      next:(res)=>{
        this.classList = res.data;
        console.log("this is edit-class:",this.classList)
         this.filteredClass = this.classList.find(
          item => item._id === id )
          console.log("fc",this.filteredClass);
          if(this.filteredClass){
            this.classForm.patchValue({
              className: this.filteredClass.title,
              image: this.filteredClass.image??'n/a',
              level: this.filteredClass.level,
              status: this.filteredClass.status ??'active',
              price: this.filteredClass.price,
              duration: this.filteredClass.duration.toString(),
              description: this.filteredClass.description,

              feature1: this.filteredClass.features?.[0] ?? '',
              feature2: this.filteredClass.features?.[1] ?? '',
              feature3: this.filteredClass.features?.[2] ?? '',
              feature4: this.filteredClass.features?.[3] ?? '',
              feature5: this.filteredClass.features?.[4] ?? ''
            });
            this.cdr.detectChanges();

          }

        }
    })

  }

  onCancel(){
    this.router.navigate(['/dashboard/classes']);

  }
 saveClass() {
 
  if(!this.filteredClass)return;
  //get raw data from form
  const formValues = this.classForm.value;

  const updatedClass: ClassPlan = {
    ...this.filteredClass, // Spreads existing fields (like _id, etc.)
    title: formValues.className ?? '',
    image: formValues.image ?? 'n/a',
    level: formValues.level ?? '',
    status: formValues.status ?? 'active',
    price: Number(formValues.price) ?? 0,
    duration: formValues.duration ?? '',
    description:formValues.description ?? '',
      createdAt:new Date(),
        updatedAt:new Date(),
    // Reconstruct the features array from the individual form inputs
    features: [
      formValues.feature1 ?? '',
      formValues.feature2 ?? '',
      formValues.feature3 ?? '',
      formValues.feature4 ?? '',
      formValues.feature5 ?? ''
    ].filter(feature => feature.trim() !== '')
  };

  console.log(updatedClass);

  this.dataService.saveClass('class','courses',updatedClass).subscribe({
    next:(res)=>{
      console.log('Fronted: data updated and saved successfuly');
      this.dataService.updatedClass = updatedClass;
      this.router.navigate(['/dashboard/update-success',updatedClass._id]);

    },
    error(err){
      console.error('Failed to save to DB...');
    }
  })




}
}
