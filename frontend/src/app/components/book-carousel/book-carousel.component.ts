import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-book-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-carousel.component.html',
  styleUrl: './book-carousel.component.css'
})
export class BookCarouselComponent {

  @Input() title: string = '';
  @Input() searchQuery: string = ''; 
  books: any[] = [];

  currentIndex = 0;
  visibleItems = 4; // Cantidad de libros visibles a la vez

  constructor(
    private cartService: CartService,
    private apiService: ApiService
  ){}

  ngOnInit() {
    if (this.searchQuery) {
      this.loadBooks();
    }
  }

  loadBooks(){
    this.apiService.findBooks(this.searchQuery, 12).subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (err) => {
        console.error('Error al cargar libros', err)
      }
      
    })
  }

  prevSlide() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  nextSlide() {
    this.currentIndex = Math.min(
      this.books.length - this.visibleItems, 
      this.currentIndex + 1
    );
  }

  get visibleBooks() {
    return this.books.slice(this.currentIndex, this.currentIndex + this.visibleItems);
  }

  addToCart(book:any){
    this.cartService.addToCart({
      id:book.id,
      title:book.title,
      price: book.price,
      cover: book.cover
    });
  }
}
