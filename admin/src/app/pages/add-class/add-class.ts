import { Component, inject } from '@angular/core';
import { ClassPlan } from '../../model/classes.model';
import { DataService } from '../../services/data.service';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-add-class',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './add-class.html',
  styleUrl: './add-class.scss',
})

export class AddClass {

  private dataService = inject(DataService);
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



  addNewClass( ){
    
    const formValues = this.classForm.value;
    const newClass: ClassPlan = {
        _id:'',
        id: `price_${Date.now()}`, 
        title: formValues.className?? '',
        image: formValues.image || '/basic-sarangi.jpg', // Fallback local asset path if blank
        level: (formValues.level as 'basic' | 'intermediate' | 'advanced') ?? 'basic',
        status: (formValues.status as 'active' | 'inactive') ?? 'active',
        price: Number(formValues.price) ?? 0,
        duration: formValues.duration ?? 'per month',
        description: formValues.description ?? '',
        createdAt: new Date(),
        updatedAt: new Date(),
        features: [
          formValues.feature1 ?? '',
          formValues.feature2 ?? '',
          formValues.feature3 ?? '',
          formValues.feature4 ?? '',
          formValues.feature5 ?? ''
        ].filter(feature => feature.trim() !== '') 
    };
    this.dataService.saveClass('class','courses',newClass).subscribe({
      next:(res)=>{
        console.log("Class saved successfully. API response",res);
        const classId = res.data.insertedId;
            console.log("Navigating with ID:", classId);

        this.router.navigate(['/dashboard/update-success',classId]);
      }
    });

    }
    
  onCancel(){
    this.classForm.reset({
        price: 0,
        level: 'basic',
        status: 'active',
        className: '',
        image: '',
        duration: '',
        description: '',
        feature1: '',
        feature2: '',
        feature3: '',
        feature4: '',
        feature5: ''
      });
      this.router.navigate(['/dashboard/classes']);
  }

}
