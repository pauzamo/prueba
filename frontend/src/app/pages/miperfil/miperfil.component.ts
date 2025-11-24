// frontend/src/app/pages/miperfil/miperfil.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { UsuarioService } from '../../services/usuario.service';

// Importar los componentes de Navbar y Footer
import { NavbarComponent } from '../../home/sections/navbar/navbar.component';
import { FooterComponent } from '../../home/sections/footer/footer.component';

@Component({
  selector: 'app-miperfil',
  standalone: true,
  // Agregar los componentes importados a la propiedad 'imports'
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent], 
  
  template: `
    <app-navbar></app-navbar>

    <div *ngIf="!perfil" class="perfil-container">
      Cargando perfil...
    </div>

    <div *ngIf="perfil" class="perfil-container">
      <div class="perfil-card">
        <h2>Mi Perfil</h2>

        <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

        <div class="perfil-info-campos">
          
          <div class="dato-group">
            <span class="dato-etiqueta">Email:</span>
            <span class="dato-valor">{{ perfil.email }}</span>
          </div>

          <div class="dato-group">
            <span class="dato-etiqueta">Nombre:</span>
            <input *ngIf="isEditing" [(ngModel)]="tempPerfil.nombre" type="text" class="dato-input" placeholder="Ingresa tu nombre">
            <span *ngIf="!isEditing" class="dato-valor">{{ perfil.nombre || '-' }}</span>
          </div>

          <div class="dato-group">
            <span class="dato-etiqueta">Apellido:</span>
            <input *ngIf="isEditing" [(ngModel)]="tempPerfil.apellido" type="text" class="dato-input" placeholder="Ingresa tu apellido">
            <span *ngIf="!isEditing" class="dato-valor">{{ perfil.apellido || '-' }}</span>
          </div>

          <div class="dato-group">
            <span class="dato-etiqueta">Teléfono:</span>
            <input *ngIf="isEditing" [(ngModel)]="tempPerfil.telefono" type="text" class="dato-input" placeholder="Ingresa tu teléfono">
            <span *ngIf="!isEditing" class="dato-valor">{{ perfil.telefono || '-' }}</span>
          </div>

          <div class="dato-group">
            <span class="dato-etiqueta">Dirección:</span>
            <input *ngIf="isEditing" [(ngModel)]="tempPerfil.direccion" type="text" class="dato-input" placeholder="Ingresa tu dirección">
            <span *ngIf="!isEditing" class="dato-valor">{{ perfil.direccion || '-' }}</span>
          </div>

          <div class="dato-group">
            <span class="dato-etiqueta">DNI:</span>
            <input *ngIf="isEditing" [(ngModel)]="tempPerfil.dni" type="text" class="dato-input" placeholder="Ingresa tu DNI">
            <span *ngIf="!isEditing" class="dato-valor">{{ perfil.dni || '-' }}</span>
          </div>
          
        </div>

        <div class="perfil-actions">
          
          <button *ngIf="!isEditing" (click)="iniciarEdicion()" class="btn-editar">
            Editar Perfil
          </button>

          <ng-container *ngIf="isEditing">
            <button (click)="guardarPerfil()" class="btn-guardar" [disabled]="isSaving">
              {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button (click)="cancelarEdicion()" class="btn-cancelar" [disabled]="isSaving">
              Cancelar
            </button>
          </ng-container>

        </div>
        
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styleUrls: ['./miperfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  perfil: any = null;
  tempPerfil: any = {};
  isEditing: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.usuarioService.getUserProfile().subscribe({
      next: (res: any) => {
        const userData = res?.user || res?.body?.user || res;

        if (userData && userData.email) {
          this.perfil = userData;
          this.tempPerfil = { ...userData };
        } else {
            this.errorMessage = "No se pudo cargar el perfil o los datos están incompletos.";
        }
      },
      error: (err: any) => {
        console.error("Error cargando perfil:", err);
        this.errorMessage = "Error de servidor al intentar cargar el perfil.";
      }
    });
  }

  iniciarEdicion(): void {
    this.isEditing = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.tempPerfil = { ...this.perfil }; 
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.errorMessage = null;
    this.successMessage = null;
    this.tempPerfil = { ...this.perfil }; 
  }

  guardarPerfil(): void {
    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const dataToUpdate = {
      nombre: this.tempPerfil.nombre,
      apellido: this.tempPerfil.apellido,
      telefono: this.tempPerfil.telefono,
      direccion: this.tempPerfil.direccion,
      dni: this.tempPerfil.dni
    };

    this.usuarioService.updateUser(dataToUpdate).subscribe({
      next: (res: any) => {
        this.perfil = { ...this.perfil, ...dataToUpdate };
        this.isEditing = false;
        this.isSaving = false;
        this.successMessage = "¡Perfil actualizado con éxito!";
      },
      error: (err: any) => {
        console.error("Error guardando perfil:", err);
        this.isSaving = false;
        this.errorMessage = err.error?.message || "Error al intentar guardar los cambios.";
      }
    });
  }
}