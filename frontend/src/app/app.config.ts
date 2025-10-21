import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { APP_CONFIG } from './tokens/app-config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // 👈 sin withCredentials
    {
      provide: APP_CONFIG,
      useValue: {
        backendBaseUrl: 'http://13.216.111.250:3000',
        userApi:        'http://13.216.111.250:3000/api/user',
        loginUrl:       'http://13.216.111.250:3000/login',
        logoutUrl:      'http://13.216.111.250:3000/logout',
      }
    }
  ]
};
