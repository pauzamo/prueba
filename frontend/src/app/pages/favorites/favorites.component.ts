// frontend/src/app/pages/favorites/favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.services';
import { BookService } from '../../services/book.service'; // Servicio existente para buscar libros

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteBookDetails: any[] = [];
  isLoading = true;

  constructor(
    private favoritesService: FavoritesService,
    private bookService: BookService 
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (response) => {
        const favoriteIds = response.favoriteApiIds;
        this.favoriteBookDetails = [];
        this.isLoading = false;

        if (favoriteIds && favoriteIds.length > 0) {
          // Usamos Promise.all para cargar los detalles de todos los libros en paralelo
          const bookRequests = favoriteIds.map(id => 
             this.bookService.getBookDetails(id).toPromise() // Asumiendo que tiene getBookDetails(id)
          );
          
          Promise.all(bookRequests)
            .then(detailsArray => {
                this.favoriteBookDetails = detailsArray.filter(d => d); // Filtrar nulos
            })
            .catch(error => console.error("Error cargando detalles de libros:", error));
        }
      },
      error: (err) => {
        console.error('Error cargando favoritos', err);
        this.isLoading = false;
      }
    });
  }

  removeFavorite(bookId: string): void {
    this.favoritesService.removeFavorite(bookId).subscribe(() => {
      // Actualizar la vista localmente
      this.favoriteBookDetails = this.favoriteBookDetails.filter(b => b.id !== bookId);
    });
  }
}