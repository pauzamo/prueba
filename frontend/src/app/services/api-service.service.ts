import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) { }

  findBooks(query: string, limit: number = 10) {
    return this.http.get(`${this.apiUrl}?q=${query}&limit=${limit}`).pipe(
      map((response: any) => {
        return response.docs.map((book: any) => ({
          id: book.key, // Usamos la clave única de Open Library como ID
          title: book.title,
          author: book.author_name ? book.author_name[0] : 'Autor desconocido',
          price: this.randomPriceGenerator(), // La API no provee precios
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'assets/default-book-cover.jpg',
          description: book.first_sentence
            ? book.first_sentence[0]
            : 'Descripción no disponible'
        }));
      })
    );
  }

  private randomPriceGenerator(): number{
    return Math.floor(Math.random() * 50) + 10;
  }
}
