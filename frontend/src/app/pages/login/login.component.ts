import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

// 1. CONFIGURACIÓN DE COGNITO (¡REEMPLAZA [TU_CLIENT_ID]!)
  private readonly COGNITO_DOMAIN = 'https://us-east-1-cdjiudhc.auth.us-east-1.amazoncognito.com';
  private readonly CLIENT_ID = '2k8b23s30om1ottpre3pm1tmr5'; // 👈 OBTÉN ESTE ID DE LA CONSOLA
  private readonly REDIRECT_URI = 'https://13.216.111.250/callback'; // 👈 La URL de retorno configurada

  ngOnInit(): void {
    // 2. CONSTRUYE LA URL DEL ENDPOINT DE AUTORIZACIÓN OIDC
    const authUrl = `${this.COGNITO_DOMAIN}/oauth2/authorize?` +
      `response_type=code&` + // Pedimos el Código de Autorización
      `client_id=${this.CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
      `scope=openid%20email%20profile`; // Los ámbitos que configuraste

    // 3. REDIRIGE AL USUARIO A LA PÁGINA DE INICIO DE SESIÓN DE COGNITO
    window.location.href = authUrl;
  }
}
