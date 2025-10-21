import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  cover: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {

    constructor(private notificationService: NotificationService){}

    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

      getTotalItems(): number {
    const items = this.cartItemsSubject.getValue();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    const items = this.cartItemsSubject.getValue();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateQuantity(id: number, newQuantity: number): void {
    const items = this.cartItemsSubject.getValue();
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      if (newQuantity <= 0) {
        this.removeFromCart(id);
      } else {
        items[index].quantity = newQuantity;
        this.cartItemsSubject.next([...items]);
      }
    }
  }

  removeFromCart(id: number): void {
    const items = this.cartItemsSubject.getValue();
    this.cartItemsSubject.next(items.filter(item => item.id !== id));
  }

  addToCart(item: Omit<CartItem, 'quantity'>): void {

    if (!item.id) {
    console.error('El item no tiene ID:', item);
    alert('Error al cargar libro al carrito');
    return;
    }
    
    const items = this.cartItemsSubject.getValue();
    const existingItem = items.find(i => i.id === item.id);
    
    if (existingItem) {
      this.updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      this.cartItemsSubject.next([...items, { ...item, quantity: 1 }]);
    }

    this.notificationService.showSuccess(`${item.title} agregado al carrito`);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.notificationService.showSuccess('Carrito vaciado correctamente');
  }
}
