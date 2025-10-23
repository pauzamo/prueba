import { Component } from '@angular/core';
import { CarouselHeroComponent } from '../../../components/carousel-hero/carousel-hero.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-hero',
  imports: [NavbarComponent,CarouselHeroComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
