import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Añadir Observable para tipado

@Injectable({ providedIn: 'root' })
export class BookService {

  private apiUrl = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // 🚨 CRÍTICO: Función Corregida y Renombrada
  getBookDetails(id: string): Observable<any> {
    // Acepta el ID como parámetro y lo usa correctamente en la URL
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  searchBooks(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?q=${query}`);
  }
}