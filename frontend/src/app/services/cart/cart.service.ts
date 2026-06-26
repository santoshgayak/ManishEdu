import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CartItem } from "../../models/cart/cart-item.model"; 

@Injectable({
    providedIn:'root'
})

export class CartService{
    private cartItems : CartItem[]=[];
    private cartSubject = new BehaviorSubject<CartItem[]>([]);
    cart$=this.cartSubject.asObservable();

    constructor(){
        //get items from cart
        const savedCart = localStorage.getItem('cart');
        if (savedCart){
            this.cartItems=JSON.parse(savedCart);
            this.cartSubject.next(this.cartItems);
        }
    }
    getCartValue(){
        return this.cartSubject.value;
    }

    //add item to cart
    addToCart(item:CartItem){
        console.log(" At service now ...");
        const existingItem = this.cartItems.find(i=> i.id==item.id);
        if(existingItem){
            existingItem.quantity++;
            console.log("Adding now...")
        }else{
            this.cartItems.push({...item,quantity:1});
            console.log("Pushing update item now.")
        }
        this.updateState();
    }

    //increase one to quantity
    incrementItemQuantity(id:string){
        this.cartItems=this.cartItems.map(item =>{
            if(item.id===id){
                return{...item,quantity:item.quantity+1};
            }
            return item;
        });
        this.updateState();
    }
     //increase one to quantity
    decrementItemQuantity(id:string){
        const item = this.cartItems.find(item => item.id === id);
        if(!item){
            return;
        }
        if(item.quantity === 1){
            this.removeItemFromCart(id);
            return;
        }

        this.cartItems = this.cartItems.map(item =>{
            if(item.id===id){
                return{...item,quantity:item.quantity-1};
            }
            return item;
        });
        this.updateState();
    }

    removeItemFromCart(id:string){
        this.cartItems = this.cartItems.filter(item=> item.id !== id);
        this.updateState();
        return;
    }

    //update the suscribers
    updateState(){
        this.cartSubject.next([...this.cartItems]);
        localStorage.setItem('cart',JSON.stringify(this.cartItems));
    }
    clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
}

}


