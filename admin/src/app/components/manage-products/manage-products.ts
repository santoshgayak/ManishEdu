import { Component, inject } from '@angular/core';
import { Product } from '../../model/products.model';
import { DataService } from '../../services/data.service';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Loader } from "../loader/loader";
@Component({
  selector: 'app-manage-products',
  imports: [RouterLink, Loader],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.scss',
})
export class ManageProducts {
  productList: Product[] = [];

  private dataService = inject(DataService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}
  ngOnInit() {
    this.loadProducts();
    this.cdr.detectChanges();
  }

  private loadProducts(): void {
    this.dataService.getData('product', 'products').subscribe({
      next: (res: any) => {
        this.productList = res.data;
        console.log('Products loaded successfully:', this.productList);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }
  navigate(){
    this.router.navigate(['/dashboard/products']);
  }
  editProduct(productId:string){
    this.router.navigate(['/dashboard/edit-product',productId]);


  }

  //delete product
  deleteProduct(productId:string){
    console.log("Delete button clicked in UI for ID:", productId);

    this.dataService.deleteProduct(productId).subscribe({
      next: (response) => {
        console.log("Backend responded successfully:", response);
        
        this.productList = this.productList.filter(item => item._id !== productId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("An error occurred during deletion of product:", err);
      }
    });
  }


}
