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
}
