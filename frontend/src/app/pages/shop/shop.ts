import { Component } from '@angular/core';
import { Footer } from "../../components/footer/footer";
import { Products } from "../../components/products/products";
import { ShopHero } from "../../components/shop-hero/shop-hero";

@Component({
  selector: 'app-shop',
  imports: [Footer, Products, ShopHero],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {}
