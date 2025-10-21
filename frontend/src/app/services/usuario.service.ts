import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../tokens/app-config.token';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private cfg: AppConfig = inject(APP_CONFIG);   // 👈 tipado explícito
  private apiUrl = this.cfg.userApi;             // http://13.216.111.250:3000/api/user

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${encodeURIComponent(email)}`,
      { withCredentials: true }                  // 👈 aquí el withCredentials
    );
  }

  updateUserByEmail(email: string, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${encodeURIComponent(email)}`,
      data,
      { withCredentials: true }                  // 👈 aquí también
    );
  }
}
