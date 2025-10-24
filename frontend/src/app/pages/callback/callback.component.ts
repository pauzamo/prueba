import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="p-8 bg-white shadow-xl rounded-lg text-center border-t-4 border-indigo-500">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Procesando inicio de sesión...</h2>
        <p class="text-gray-600">Verificando tokens de AWS Cognito. Por favor, espere.</p>
        <div class="mt-4">
          <!-- Simple spinner de Tailwind CSS -->
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </div>
    </div>
  `,
  // Los estilos se pueden agregar en un archivo callback.component.css si es necesario
  // o usar clases de Tailwind/CSS en línea como se muestra arriba.
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code']; // Captura el código enviado por Cognito
      
      if (code) {
        // Llama a tu backend para intercambiar el código OIDC por tokens
        this.authService.exchangeCognitoCode(code).subscribe({
          next: (response) => {
            console.log('Sesión iniciada con éxito. Redirigiendo...', response);
            // Redirige al usuario a la página principal después de la autenticación
            this.router.navigate(['/']); 
          },
          error: (err) => {
            console.error('Error durante el intercambio de código:', err);
            // Muestra un mensaje de error y redirige a la página de login
            alert('Error de autenticación. Intente nuevamente.');
            this.router.navigate(['/login']); 
          }
        });
      } else {
        // No hay código (puede ser un error de Cognito o acceso directo)
        console.warn('Callback sin código de autorización. Redirigiendo a login.');
        this.router.navigate(['/login']);
      }
    });
  }
}
