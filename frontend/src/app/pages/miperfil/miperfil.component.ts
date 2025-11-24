import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-miperfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="perfil-container" *ngIf="perfil">
      <h2>Mi Perfil</h2>

      <p><strong>Email:</strong> {{ perfil.email }}</p>
      <p><strong>Nombre:</strong> {{ perfil.nombre || '-' }}</p>
      <p><strong>Apellido:</strong> {{ perfil.apellido || '-' }}</p>
      <p><strong>Telefono:</strong> {{ perfil.telefono || '-' }}</p>
      <p><strong>Direccion:</strong> {{ perfil.direccion || '-' }}</p>
      <p><strong>DNI:</strong> {{ perfil.dni || '-' }}</p>
    </div>

    <div *ngIf="!perfil">
      Cargando perfil...
    </div>
  `,
  styleUrls: ['./miperfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  perfil: any = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {

    this.usuarioService.getUserProfile().subscribe({
      next: (res: any) => {
        console.log("Perfil recibido:", res);
        this.perfil = res.user;   // viene así del backend
      },
      error: (err: any) => {
        console.error("Error cargando perfil:", err);
      }
    });

  }
}
