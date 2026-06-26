import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { CartService } from '../../services/cart/cart.service'
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  cartCount = 0;
    isMenuOpen = false;


  constructor (private cartService: CartService){
    this.cartService.cart$.subscribe(item=>{
      this.cartCount = item.reduce((sum,item)=> sum+item.quantity,0);
    });
  }


  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
    
  }
  closeMenu(){
    this.isMenuOpen=false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }
  

}
