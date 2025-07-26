import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  const userToken = localStorage.getItem('access_token');

    if (userToken) {
      const modifiedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${userToken}`)
      });
      return next(modifiedRequest);
    }

    // If no token, send the original request without modification
    return next(req);
};