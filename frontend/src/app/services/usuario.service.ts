// frontend/src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser } from '../models/register.model'; 
import { User } from '../models/user.model'; 

const API_URL = 'http://localhost:3000/api/auth'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient) { }
  
  //  REGISTRAR PERFIL: Crea el registro en la DB local (sin contraseña)
  registerUser(userData: RegisterUser): Observable<any> {
    // La ruta es /api/auth/register-profile
    return this.http.post(`${API_URL}/register-profile`, userData);
  }

  // OBTENER PERFIL: Busca el perfil local por email
  getUserByEmail(email: string): Observable<any> {
    // La ruta es POST /api/auth/profile y requiere el email en el cuerpo
    return this.http.post(`${API_URL}/profile`, { email }); 
  }
  
  // ACTUALIZAR PERFIL: La identidad (email) la extrae el backend del token.
  updateUser(userData: User): Observable<any> {
    // La ruta protegida es PUT /api/auth/profile. El Interceptor ya envía el token.
    // Asegúrese de que userData no contenga el campo 'password'.
    return this.http.put(`${API_URL}/profile`, userData); 
  }


}