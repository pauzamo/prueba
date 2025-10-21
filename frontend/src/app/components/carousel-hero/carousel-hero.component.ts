import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel-hero',
  standalone: true,
  imports: [],
  templateUrl: './carousel-hero.component.html',
  styleUrl: './carousel-hero.component.css'
})
export class CarouselHeroComponent {

currentSlide = 0;
  books = [
    {
      title: 'Libro 1',
      image: 'img1-carousel-hero.png'  // Asegúrate de tener estas imágenes
    },
    {
      title: 'Libro 2',
      image: 'img2-carousel-hero.jpg'
    },
    {
      title: 'Libro 3',
      image: 'img3-carousel-hero.jpg'
    }
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.books.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.books.length) % this.books.length;
  }
}