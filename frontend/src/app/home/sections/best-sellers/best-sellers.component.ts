import { Component } from '@angular/core';
import { BookCarouselComponent } from '../../../components/book-carousel/book-carousel.component';

@Component({
  selector: 'app-best-sellers',
  imports: [BookCarouselComponent],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.css'
})
export class BestSellersComponent {

}
