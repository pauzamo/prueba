import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookService {

    //TODO
    //importar controller

  private apiUrl = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<any[]>(`${this.apiUrl}/`);;
  }

  getBooksById() {
    return this.http.get<any[]>(`${this.apiUrl}/{id}`);;
  }

  searchBooks(query: string) {
  return this.http.get<any[]>(`${this.apiUrl}?q=${query}`);
  }


}
