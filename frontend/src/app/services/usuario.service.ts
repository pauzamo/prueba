import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'https://13.216.111.250:3000/api/user'; 

  constructor(private http: HttpClient) {}

  // Obtener usuario por email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`);
  }

  // Actualizar usuario por email
  updateUserByEmail(email: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${email}`, data);
  }
}
