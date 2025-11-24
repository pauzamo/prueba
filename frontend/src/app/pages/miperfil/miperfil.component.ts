import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service'; // <-- NUEVA IMPORTACIÓN
import { NavbarComponent } from '../../home/sections/navbar/navbar.component';
import { FooterComponent } from '../../home/sections/footer/footer.component';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: any = {};
  usuarioOriginal: any = {};
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  editMode = false;

  // <-- INYECTAR AuthService
  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService // <-- Inyectar AuthService
  ) {}

  ngOnInit(): void {
    // 1. Obtener el email directamente del token de Cognito
    const email = this.authService.getUserEmail(); 
    
    if (email) {
      this.loadUserData(email);
    } else {
      // 2. Si no hay email, el usuario no está autenticado o el token es inválido/expirado
      this.error = 'Usuario no autenticado. Por favor, inicie sesión.';
      // Opcional: Redirigir al login si el email no se encuentra
      // this.router.navigate(['/login']); 
    }
  }

  loadUserData(email: string): void {
    this.isLoading = true;
    this.error = null;

    // 3. Usar el nuevo método getUserByEmail que envía el email en el body (POST /api/auth/profile)
    this.usuarioService.getUserByEmail(email).subscribe({
      next: (response) => {
        // Asumimos que la respuesta trae el objeto de usuario bajo 'user'
        const user = response.user || response;
        this.usuario = { ...user };
        this.usuarioOriginal = { ...user };
        this.isLoading = false;
        // Opcional: Quitar campo password si el backend lo devuelve (aunque no debería)
        if (this.usuario.password) delete this.usuario.password;
        if (this.usuarioOriginal.password) delete this.usuarioOriginal.password;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del perfil local. ¿Ha completado el registro de su perfil?';
        this.isLoading = false;
        console.error(err);
      }
    });
  }


  activarEdicionGlobal(): void {
    this.editMode = true;
    this.success = null;
    this.error = null;
  }


  guardarCambiosGlobal(): void {
    // CRÍTICO: Eliminar la llamada a encodeURIComponent y usar la función de servicio corregida.
    // El Interceptor ya adjunta el token JWT, por lo que el backend sabe a qué email actualizar.
    
    // 4. Llamar a updateUser (PUT /api/auth/profile) con solo los datos del perfil
    this.usuarioService.updateUser(this.usuario).subscribe({
      next: (res) => {
        this.success = 'Datos actualizados con éxito';
        this.error = null;
        this.editMode = false;
        this.usuarioOriginal = { ...this.usuario };
      },
      error: (err) => {
        this.error = 'Error al actualizar los datos';
        this.success = null;
        console.error(err);
      }
    });
  }


  cancelarEdicionGlobal(): void {
    this.usuario = { ...this.usuarioOriginal };
    this.editMode = false;
    this.error = null;
    this.success = null;
  }
}