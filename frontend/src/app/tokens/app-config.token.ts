import { InjectionToken } from '@angular/core';

export interface AppConfig {
  backendBaseUrl: string;
  userApi: string;
  loginUrl: string;
  logoutUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const DEFAULT_APP_CONFIG: AppConfig = {
    backendBaseUrl: 'https://13.216.111.250:3000/api', 
    userApi: '/users',
    loginUrl: '/auth/login',
    logoutUrl: '/auth/logout',
};