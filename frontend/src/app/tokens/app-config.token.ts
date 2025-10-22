import { InjectionToken } from '@angular/core';

export interface AppConfig {
  backendBaseUrl: string;
  userApi: string;
  loginUrl: string;
  logoutUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const DEFAULT_APP_CONFIG: AppConfig = {
    // Usamos HTTP en la configuración por defecto
    backendBaseUrl: 'http://13.216.111.250:3000/api', 
    userApi: '/users',
    loginUrl: 'http://13.216.111.250:3000/login',
    logoutUrl: 'http://13.216.111.250:3000/logout',
};