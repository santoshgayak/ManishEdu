import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../model/products.model';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);
  constructor() {}

  productForm = this.fb.group({
    id: [''],
    name: [''],
    category: [''],
    image: [''],
    price: [0],
    stock: [0],
    description: [''],
  });

  onCancel() {
    this.router.navigate(['/dashboard/products']);
  }
  addNewProduct() {
    const date = new Date();
    const formValues = this.productForm.value;
    const newProduct: Product = {
      _id: '',
      id: `price_${Date.now()}`,
      name: formValues.name ?? '',
      category: formValues.category ?? '',
      image: formValues.image || '/images/products/basic-sarangi.jpg',
      price: Number(formValues.price) ?? 0,
      description: formValues.description ?? '',
      stock: formValues.stock ?? 1,
      createdAt: date,
      updatedAt: date,
    };
    this.dataService.saveProduct('product', 'products', newProduct).subscribe({
      next: (res) => {
        console.log('Product saved successfully.');
        const productId = res.data.insertedId;
        console.log('Navigating with ID:', productId);

        this.router.navigate(['/dashboard/update-success-product', productId]);
      },
    });
  }
}
