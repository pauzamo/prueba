import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../../tokens/app-config.token';

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
  private cfg: AppConfig = inject(APP_CONFIG);  // 👈 tipado explícito

  ngOnInit(): void {
    window.location.href = this.cfg.loginUrl;
  }
}
