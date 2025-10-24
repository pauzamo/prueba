import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showCart = false;

  constructor(
    private viewportScroller: ViewportScroller,
    public cartService: CartService,
    private router: Router
  ) {}

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
    this.showCart = false;
  }
  // 👇 NUEVA FUNCIÓN PARA LOGOUT
  
  
  logout(): void {
    
    // 1. Limpieza local (opcional, pero buena práctica)
    localStorage.removeItem('email');
    localStorage.removeItem('token'); 
    localStorage.removeItem('userId'); 
    this.cartService.clearCart(); 

    // 2. Definir la configuración de Cognito (¡DEBES REEMPLAZAR ESTOS VALORES!)
    const COGNITO_DOMAIN = 'https://Biblioapp.auth.us-east-1.amazoncognito.com'; // Ej. my-app-domain.auth.region.amazoncognito.com
const CLIENT_ID = '1951tqfvb7fakucpruls1e1875';
    const LOGOUT_URI = 'http://localhost:4200/login'; // O la URL de tu aplicación en producción

    // 3. Redirigir al endpoint de cierre de sesión de Cognito
    const cognitoLogoutUrl = 
      `${COGNITO_DOMAIN}/logout?` + 
      `client_id=${CLIENT_ID}&` + 
      `logout_uri=${LOGOUT_URI}`;

    // Forzamos la navegación completa para salir del contexto de Cognito
    window.location.href = cognitoLogoutUrl;
}
}
