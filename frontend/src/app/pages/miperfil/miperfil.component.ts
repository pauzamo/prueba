import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../home/sections/navbar/navbar.component';
import { FooterComponent } from '../../home/sections/footer/footer.component';
import { AuthService } from '../../services/auth.service'; // <--- AÑADIDO: Importar AuthService


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
  
  // CONSTRUCTOR MODIFICADO: Inyectar AuthService
  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService // <--- AÑADIDO: Inyección del servicio
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.loadUserData(email);
    } else {
      this.error = 'No se encontró el email';
    }
  }

  loadUserData(email: string): void {
    this.isLoading = true;
    this.error = null;

    this.usuarioService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.usuario = { ...user };
        this.usuarioOriginal = { ...user };
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        // 🚨 LÓGICA DE FALLBACK AÑADIDA
        // Si el servidor devuelve 404 (Usuario no encontrado en DB), intentamos sincronizar.
        if (err.status === 404) {
          console.warn('Usuario no encontrado en la DB local. Intentando sincronización forzada...');
          this.error = 'Sincronizando perfil. Espera un momento...';
          this.syncUserToDB(email);
        } else {
          this.error = 'Error al cargar los datos del usuario: ' + (err.error?.message || 'Error desconocido');
          console.error(err);
        }
      }
    });
  }
  
  // 👇 FUNCIÓN PARA FORZAR EL REGISTRO (SINCRONIZACIÓN)
  syncUserToDB(email: string): void {
    
    this.isLoading = true;
    this.error = null;
    
    // Genera una contraseña aleatoria y valores por defecto. 
    // Es necesario enviar todos los campos que tu API de registro requiere.
    const dummyPassword = Math.random().toString(36).slice(-10) + 'A1!'; 
    
    const payload = {
      email: email,
      password: dummyPassword,
      nombre: 'Usuario', 
      apellido: 'Cognito', 
      telefono: 'N/A', 
      direccion: 'N/A', 
      dni: 'N/A' 
    };

    // Llama al endpoint /api/auth/register de tu backend
    this.authService.register(payload).subscribe({
      next: () => {
        console.log('Sincronización forzada exitosa. Reintentando carga...');
        // Si el registro fue exitoso, reintentamos cargar el perfil.
        this.loadUserData(email); 
      },
      error: (syncErr) => {
        // Muestra error si la API de registro falla (ej. problema con SQL)
        this.error = 'Error crítico: La sincronización del perfil falló.';
        this.isLoading = false;
        console.error('Error de sincronización:', syncErr);
      }
    });
  }

  activarEdicionGlobal(): void {
    this.editMode = true;
    this.success = null;
    this.error = null;
  }


  guardarCambiosGlobal(): void {

    const email = encodeURIComponent(this.usuario.email);

    this.usuarioService.updateUserByEmail(email, this.usuario).subscribe({
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