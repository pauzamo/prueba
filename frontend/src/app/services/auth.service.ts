import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private URL = 'https://13.216.111.250/api/auth'; // Usamos la IP de tu EC2
  private URLUser = 'https://13.216.111.250/api/user';

  constructor(private http: HttpClient) {}

  // ⚠️ NUEVO MÉTODO: Envía el código de Cognito a tu backend para el intercambio de tokens
  exchangeCognitoCode(code: string): Observable<any> {
    return this.http.post(`${this.URL}/exchange-code`, { code: code });
  }

  // El método 'login' original ya no se usa en el flujo OIDC, puedes eliminarlo o comentarlo
  // login(data: any): Observable<any> {
  //   return this.http.post(`${this.URL}/login`, data);
  // }

  register(data: any): Observable<any> {
    return this.http.post(`${this.URL}/register`, data);
  }
  
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.URLUser}/${email}`);
  }
}