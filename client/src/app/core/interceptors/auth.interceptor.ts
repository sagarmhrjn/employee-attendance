import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  baseUrl = environment.baseUrl;

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: accessToken
        },
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: this.baseUrl + request.url
      })
    }else{
      request = request.clone({
        url: this.baseUrl + request.url
      })
    }
    return next.handle(request);
  }
}
