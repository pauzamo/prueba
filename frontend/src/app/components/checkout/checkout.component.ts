import { Component } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  paymentData: Payment = {
    nroTarjeta: '',
    fechaVencimiento: '',
    clave: '',
    idUsuario: 0,
    importe: 0 
  };

  cardId: number = 0;
  
  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private router: Router
  ) {
    this.paymentData.importe = this.cartService.getTotalPrice();
  }

  submitPayment(): void {
    if (!this.paymentData.nroTarjeta || !this.paymentData.fechaVencimiento || !this.paymentData.clave) {
      alert('Por favor complete todos los campos');
      return;
    }

    const userIdStr = localStorage.getItem('userId');
    const userId = Number(userIdStr);

    this.paymentData.idUsuario = userId;

    this.checkoutService.processPayment(this.paymentData).subscribe({
      next: (response) => {
        console.log('Pago exitoso', response);
        this.cartService.clearCart();
        this.router.navigate(['/home']);
        alert('¡Pago exitoso!');
      },
      error: (error) => {
        console.error('Error en el pago', error);
        alert('Error en el pago: ' + (error.error?.message || 'Intente nuevamente'));
      }
    });
  }

  deleteCard(): void {
  const userId = Number(localStorage.getItem('userId'));

  this.checkoutService.getCardByUserId(userId).subscribe({
    next: (card: any) => {
      if (!card || !card.idTarjeta) {
        alert('No se encontró tarjeta para eliminar.');
        return;
      }
      this.checkoutService.deleteCard(card.idTarjeta, userId).subscribe({
        next: (response) => {
          alert('Tarjeta eliminada correctamente');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          alert('Error al eliminar la tarjeta');
          console.error(err);
        }
      });
    },
    error: (err) => {
      alert('Error al obtener tarjeta');
      console.error(err);
    }
  });
}


  
}