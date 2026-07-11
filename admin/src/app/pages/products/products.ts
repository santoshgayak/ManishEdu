import { Component } from '@angular/core';
import { ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { DataService } from '../../services/data.service';
import { Product } from '../../model/products.model';
import { NgClass, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [NgClass, NgFor, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  productList: Product[] = [];    
  constructor() {}


  ngOnInit() {
    this.dataService.getData('product','products').subscribe({
        next: (res) => {
          this.productList = res.data;
          console.log('Products: indide from ', this.productList);
          this.cdr.detectChanges();

        }
      });
  }



  navigate(){
    
  }
  addNewProduct(){
    this.router.navigate(['/dashboard/add-product']);
    
  }
  
  //delete product
  deleteProduct(productId:string){
    console.log("Delete button clicked in UI for ID:", productId);

    // CRITICAL: You must use .subscribe() here to trigger the network request!
    this.dataService.deleteProduct(productId).subscribe({
      next: (response) => {
        console.log("Backend responded successfully:", response);
        
        // Optional: Remove the deleted class from your local array to update the UI instantly
        this.productList = this.productList.filter(item => item._id !== productId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("An error occurred during deletion of product:", err);
      }
    });
  }
  editProduct(productId: string) {
    console.log('Edit product with ID:', productId);
    this.router.navigate(['dashboard/edit-product',productId]);
  } 
}
