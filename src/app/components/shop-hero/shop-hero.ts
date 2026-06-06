import { Component } from '@angular/core';

@Component({
  selector: 'app-shop-hero',
  imports: [],
  templateUrl: './shop-hero.html',
  styleUrl: './shop-hero.css',
})
export class ShopHero {
    shopNow() {
        console.log("Shop Now clicked!");
    }
}
