import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-catalogo',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  books: any[] = [];
  searchQuery: string = ''; // Búsqueda inicial por defecto

  filters = {
    minPrice: 0,
    maxPrice: 100000,
    author: ''
  };

  constructor(
      private cartService: CartService,
  ){}

  private bookService = inject(BookService);

  ngOnInit() {
    this.buscarLibros(); // Carga inicial
  }

  buscarLibros() {
    this.bookService.searchBooks(this.searchQuery).subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        console.error('Error al buscar libros:', err);
      }
    });
  }

  get filteredBooks() {
    return this.books.filter(book =>
      book.price >= this.filters.minPrice &&
      book.price <= this.filters.maxPrice &&
      book.author.toLowerCase().includes(this.filters.author.toLowerCase())
    );
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
