import { ChangeDetectorRef, Component } from '@angular/core';
import { CartItem } from '../../models/cart/cart-item.model';
import { CartService } from '../../services/cart/cart.service'
import { PRODUCTS } from '../../data/products';
import { Product} from '../..//models/product/product.model'
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

//interface for resposne
interface ApiResponse{
  success:boolean;
  data:Product[];
}


@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

    products: Product [] = [];
    filteredProducts: Product [] = [];

    //lsit of filters
    categories = ['All','Sarangi','Bansuri','Madal','less than $1200'];
    selectedCategory = 'All';

    constructor(
      private cartService: CartService,
      private http: HttpClient,
      private cdr: ChangeDetectorRef
    ){
     

    }

    //load the products from database
    ngOnInit(){
       this.http.get<ApiResponse>('https://manisheduserver.onrender.com/api/data/products').subscribe({
        next:(res)=>{
          console.log("Data successfully arived at products:",res.data);
          this.products = res.data;
          this.filteredProducts=this.products;
          this.cdr.detectChanges();
        },
      error: (err) => {
        console.error("Failed to load products:", err);
      }
      })

    }

    //set category
    setCategory(category:string){
      this.selectedCategory=category;
      this.filterCategory(category);
    }

    filterCategory(category: string) {
      if (category === 'All') {
        this.filteredProducts = this.products;
        return;
      }
      
      if (category === 'less than $1200') {
        this.filteredProducts = this.products.filter(
          product => Number(product.price) < 1200
        );
        return;
      }

      this.filteredProducts = this.products.filter(product => {
        if (!product.category) return false; 
        return product.category.trim().toLowerCase() === category.trim().toLowerCase();
      });
    }

    //add products to cart 
  addToCart(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    console.log(" i am in",product);
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description:product.description,
      quantity: 1,
      image:product.image
    });
  }
}
