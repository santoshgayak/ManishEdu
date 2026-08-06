import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Footer } from "../../components/footer/footer";
import { CartService } from '../../services/cart/cart.service'
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart/cart-item.model';
import { PRODUCTS } from '../../data/products';
import { Product} from '../..//models/product/product.model'
import { Products } from '../../components/products/products';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buy-now',
  imports: [ReactiveFormsModule, Footer, CommonModule, RouterLink],
  templateUrl: './buy-now.html',
  styleUrl: './buy-now.css',
})
export class BuyNow{

  cartItems: any = [];
  cartCount = 0;
  subTotal = 0;
  tax = 0;
  orderTotal = 0;
  taxRate = 0.08;
  discountRate = 10;
  discount = 0;


  constructor(private router : Router, 
    private cartSerive: CartService,
  private http:HttpClient){

  }


  
//calculate summary of the cart total
  ngOnInit(){
      this.cartSerive.cart$.subscribe(items=>{
      this.cartItems = items;

       this.subTotal = items.reduce(
       (total,item)=>total + item.price*item.quantity,0);

       this.discount = this.subTotal*this.discountRate/100;
       this.tax = this.subTotal* this.taxRate;
       this.orderTotal = this.subTotal + this.tax - this.discount;

       this.cartCount = items.reduce((sum,item)=>sum+item.quantity,0);

    });

  }

  //route to customer-info
  proceedToPayment(){
    this.router.navigate(['/customer-info']);
  }

  //increase the quatitity of an item
  addItem(id:string){
    this.cartSerive.incrementItemQuantity(id);

  }

  //substract the quantity of an item
    subtractItem(id:string){
    this.cartSerive.decrementItemQuantity(id);
   
  }

  //delete item from the cart
    deleteItemFromCart(id:string){
    this.cartSerive.removeItemFromCart(id);
   
  }

}
