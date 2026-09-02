import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth-service';

@Injectable()
export class ReqHeaderInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'AUTH_JWT_TOKEN': this.authService.getJwtToken()
      },
    });
    return next.handle(modifiedReq);
  }
  
}