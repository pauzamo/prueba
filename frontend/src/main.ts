import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_CONFIG, DEFAULT_APP_CONFIG } from './app/tokens/app-config.token'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    
    // 💡 SOLUCIÓN: Añadir el Proveedor de APP_CONFIG
    {
        provide: APP_CONFIG, // El token que se inyectará
        useValue: DEFAULT_APP_CONFIG, // El valor que se devuelve
    }
  ]
});
