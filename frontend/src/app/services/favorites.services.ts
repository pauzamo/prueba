import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/favorites'; // La nueva ruta del backend

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient) { }

  // GET /api/favorites: Retorna la lista de IDs de libros de la API externa
  getFavorites(): Observable<{ favoriteApiIds: string[] }> {
    // El Interceptor adjunta el token JWT
    return this.http.get<{ favoriteApiIds: string[] }>(API_URL);
  }

  // POST /api/favorites: Agrega un libro a favoritos
  addFavorite(libroApiId: string): Observable<any> {
    return this.http.post(API_URL, { libroApiId });
  }

  // DELETE /api/favorites/:libroApiId: Elimina un libro de favoritos
  removeFavorite(libroApiId: string): Observable<any> {
    return this.http.delete(`${API_URL}/${libroApiId}`);
  }
}