import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Product } from '../../model/products.model';

@Component({
  selector: 'app-update-success-product',
  imports: [NgIf, RouterLink],
  templateUrl: './update-success-product.html',
  styleUrl: './update-success-product.scss',
})
export class UpdateSuccessProduct {
   private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  showToast = false;


  productList: Product[]=[];
  filteredProduct?:Product | null = null;
  
showDeleteToast = false;

  
productForm = this.fb.group({
  id:[''],
  name: [''],
  image: [''],
  category: [''],
  price: [0],
  description: [''],

});
  constructor(){

  }
  ngOnInit(){
    this.getEditingProductData();
    
  }

  getEditingProductData(){
    const id = this.route.snapshot.paramMap.get('productId');
    console.log("this is id in udate recieved",id);
    this.dataService.getData('product','products').subscribe({
      next:(res)=>{
        this.productList = res.data;
        console.log("this is update-product:",this.productList)
         this.filteredProduct = this.productList.find(
          item => item._id === id )
          console.log("fc",this.filteredProduct);
          if(this.filteredProduct){
            this.showToast=true;
          }
          this.cdr.detectChanges();
        

        }
    })

  }

   editClass(productId: string) {
      console.log('Edit product with ID:', productId);
      this.router.navigate(['/dashboard/edit-product',productId])
    }


    
  deleteProduct(productId: string) {

  if(!confirm("Are you sure you want to delete this product?")){
    return;
  }

  this.dataService.deleteProduct(productId).subscribe({
    next: (response) => {

      console.log("Backend responded successfully:", response);
      this.filteredProduct=null;
      this.showDeleteToast = true;
      this.showToast=false;
      this.cdr.detectChanges();

      // wait 10 seconds before navigating
      setTimeout(() => {
        this.router.navigate(['/dashboard/products']);
      }, 20000);

    },
    error: (err) => {
      console.error("An error occurred during deletion of product:", err);
    }
  });
}





closeToast() {
  this.showToast = false;
}
}
