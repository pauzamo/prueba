// frontend/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- MODIFICACIÓN 1

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // <-- MODIFICACIÓN 2

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([AuthInterceptor]) 
    )
  ]
};