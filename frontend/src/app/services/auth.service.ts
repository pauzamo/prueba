import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORTANTE: Requiere jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mantener isLogged u otras variables de estado si las usa
  isLogged = new BehaviorSubject<boolean>(this.checkToken()); 
  
  constructor(private http: HttpClient, private router: Router) { }

  private readonly TOKEN_KEY = 'token'; 

  // Función auxiliar para inicializar el estado de sesión
  private checkToken(): boolean {
      return !!this.getToken();
  }


  //Almacenar el Token de Cognito (ID Token)
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLogged.next(true); // Actualizar el estado de sesión
  }

  //Obtener el Token para el Interceptor
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  //Decodificar el Token para obtener el email (clave de la DB)
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        // La librería jwt-decode verifica automáticamente la expiración
        return jwtDecode(token);
      } catch (Error) {
        console.error("Token de Cognito inválido:", Error);
        this.logout(); // Si falla la decodificación, forzar cierre de sesión
        return null;
      }
    }
    return null;
  }
  
  //Obtener el email del usuario logueado
  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    // Usamos 'email' (atributo estándar) o 'username' (a veces usado por Cognito)
    return decoded ? (decoded.email || decoded.username) : null; 
  }

  //Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isLogged.value;
  }

  //Cierre de sesión (Redirecciona al backend para el logout de Cognito)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLogged.next(false);
    // Redirigir al endpoint de LOGOUT del backend de Cognito
    window.location.href = 'http://localhost:3000/logout'; 
  }

  
}