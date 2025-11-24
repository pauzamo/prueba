import { Component } from '@angular/core';
import { FooterComponent } from './sections/footer/footer.component';
import { BankPromotionsComponent } from '../components/bank-promotions/bank-promotions.component';
import { BookCarouselComponent } from '../components/book-carousel/book-carousel.component';
import { HeroComponent } from './sections/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent,BankPromotionsComponent,BookCarouselComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {



}
