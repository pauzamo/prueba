import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <h2>Redirigiendo al portal de inicio de sesión...</h2>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');

      if (code) {
        this.handleCognitoCallback(code);
        return;
      }

      
      if (this.authService.isLoggedIn()) {
  this.router.navigate(['/home']);  
  return;
}

      // Si no hay ni code ni token, inicio login en Cognito
      this.redirectToCognito();
    });
  }

  // Redirige al backend que arma la URL de Cognito
  redirectToCognito(): void {
    window.location.href = 'http://localhost:3000/login';
  }

  // Maneja el code → llama a /callback → guarda token → crea perfil → navega
  handleCognitoCallback(code: string): void {
    this.http.get('http://localhost:3000/callback', {
      params: { code },
      withCredentials: true   // importante para que llegue la cookie de sesión
    }).subscribe({
      next: (response: any) => {
        const idToken = response?.token?.id_token;

        if (!idToken) {
          console.error('Error: Token ID no encontrado en la respuesta del backend.');
          return;
        }

        // 1) Guardar token en localStorage
        this.authService.setToken(idToken);

        // 2) Registrar/crear perfil local (si ya existe, backend devuelve 200)
        this.http.post('http://localhost:3000/api/auth/register-profile', {
          nombre: '',
          apellido: '',
          telefono: '',
          direccion: '',
          dni: ''
        }).subscribe({
          next: () => this.router.navigate(['/home']), 
          error: () => this.router.navigate(['/home'])
        });
      },
      error: (err: any) => {
        console.error('Error en el callback del backend:', err, err.error);
      }
    });
  }
}
