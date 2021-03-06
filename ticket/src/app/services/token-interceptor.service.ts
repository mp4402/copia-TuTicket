import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {


  constructor(
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: String(this.authService.getToken())
      }
    })
    return next.handle(tokenizeReq);
  }

}
