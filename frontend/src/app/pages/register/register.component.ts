import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterUser } from '../../models/register.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: RegisterUser = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    dni: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
  this.authService.register(this.user).subscribe({
    next: res => {
      console.log('Registro exitoso:', res);
      this.router.navigate(['/login']); // Redirección al login
    },
    error: err => {
      console.error('Error en registro:', err);
      alert('Error al registrarse. Por favor, intentá nuevamente.');
    }
  });
}
}
