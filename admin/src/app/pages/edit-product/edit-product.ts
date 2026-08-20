import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../model/products.model';

@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct {
  productList: Product[] = [];
  filteredProduct?: Product | null = null;

  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  productForm = this.fb.group({
    id: [''],
    name: [''],
    image: [''],
    category: [''],
    price: [0],
    description: [''],
    stock: [0],
  });
  constructor() {}

  ngOnInit() {
    this.getEditingProductData();
  }

  getEditingProductData() {
    const id = this.route.snapshot.paramMap.get('productId');

    this.dataService.getData('product', 'products').subscribe({
      next: (res) => {
        this.productList = res.data;
        console.log('this is edit-class:', this.productList);

        this.filteredProduct = this.productList.find((item) => item._id === id);
        console.log('FOUND PRODUCT:', this.filteredProduct);

        console.log('First product id:', this.productList[0]._id);
        console.log('Type:', typeof this.productList[0]._id);
        console.log('URL id:', id);
        console.log('Type:', typeof id);

        if (this.filteredProduct) {
          this.productForm.patchValue({
            id: this.filteredProduct.id,
            name: this.filteredProduct.name,
            image: this.filteredProduct.image ?? 'n/a',
            category: this.filteredProduct.category,
            price: this.filteredProduct.price,
            description: this.filteredProduct.description,
          });
          this.cdr.detectChanges();
        }
      },
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard/products']);
  }
  saveProduct() {
    console.log('SAVE BUTTON CLICKED');

    if (!this.filteredProduct) return;
    console.log('SAVE BUTTON CLICKED after rrr');

    //get raw data from form
    const formValues = this.productForm.value;

    const updatedProduct: Product = {
      ...this.filteredProduct,
      id: formValues.id ?? '',
      name: formValues.name ?? '',
      image: formValues.image ?? 'n/a',
      category: formValues.category ?? '',
      price: Number(formValues.price) ?? 0,
      description: formValues.description ?? '',
      stock: formValues.stock ?? 0,
      createdAt: this.filteredProduct.createdAt,
      updatedAt: new Date(),
    };
    console.log(' updatred product:', updatedProduct);

    this.dataService.saveProduct('product', 'products', updatedProduct).subscribe({
      next: (res) => {
        console.log('Fronted: data updated and saved successfuly');
        this.dataService.updatedProduct = updatedProduct;
        this.router.navigate(['/dashboard/update-success-product', updatedProduct._id]);
      },
      error(err) {
        console.error('Failed to save to DB...');
      },
    });
  }
}
