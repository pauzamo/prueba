import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:3000/api/'; 

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  // 2. Declarar la variable 'isInternalApi'
  const isInternalApi = req.url.startsWith(API_BASE_URL); // ⬅️ ¡Esta línea no debe faltar!

  // 3. Adjuntar el token SOLO si hay token Y es una API interna
  if (token && isInternalApi && !req.url.includes('/callback')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};