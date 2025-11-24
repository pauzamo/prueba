// frontend/src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {}

  // Crear perfil local (solo después del login Cognito)
  registerUser(data: any): Observable<any> {
    return this.http.post(`${API_URL}/register-profile`, data);
  }

  // Obtener perfil del usuario autenticado
  getUserProfile(): Observable<any> {
    return this.http.get(`${API_URL}/profile`);
  }

  // Actualizar perfil
  updateUser(data: any): Observable<any> {
    return this.http.put(`${API_URL}/profile`, data);
  }
}
