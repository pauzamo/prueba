import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterUser } from '../../models/register.model'; 
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html', // 
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: RegisterUser = {
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    dni: '',
    // CRÍTICO: Asegúrese de que 'password' ya no exista aquí
  };
  isLoading = false;
  success: string | null = null;
  error: string | null = null;

  // Inyectar el servicio correcto para el registro de perfil
  constructor(
    private usuarioService: UsuarioService, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir a Home.
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  register(): void {
    this.isLoading = true;
    this.success = null;
    this.error = null;

    this.usuarioService.registerUser(this.user).subscribe({
      next: (res: any) => { // Definición de tipo para evitar TS7006
        this.success = 'Registro de perfil completado con éxito. Por favor, inicie sesión.';
        this.isLoading = false;
        // Opcional: limpiar el formulario o redirigir
        // this.router.navigate(['/login']); 
      },
      error: (err: any) => { // Definición de tipo para evitar TS7006
        this.error = err.error?.message || 'Error al completar el registro del perfil.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}