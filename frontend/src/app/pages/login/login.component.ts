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
        // Estamos regresando de Cognito con el código de autorización
        this.handleCognitoCallback(code);
      } else if (this.authService.isLoggedIn()) {
        this.router.navigate(['/home']);
      }
    });
  }

  // Función llamada desde el botón de Login en el HTML
  redirectToCognito(): void {
    // Redirige al endpoint /login de su backend, que inicia el flujo PKCE de Cognito
    window.location.href = 'http://localhost:3000/login'; 
  }

  // Lógica para manejar el código y obtener el token JWT
  handleCognitoCallback(code: string): void {
    this.http.get(`http://localhost:3000/callback?code=${code}`).subscribe({
      next: (response: any) => {
        const idToken = response.token.id_token; 
        
        if (idToken) {
            this.authService.setToken(idToken); 
            this.router.navigate(['/home']); 
        } else {
            console.error('Error: Token ID no encontrado.');
            this.router.navigate(['/login']); 
        }
      },
      error: (err) => {
        console.error('Error en el callback del backend:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
