import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class IntInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token: any = localStorage.getItem('token');
    if (token == null) return next.handle(request);
    //Se captura la fecha de expiracion en
    //formato epoch
    const payload: any = JSON.parse(atob(token.split('.')[1])).exp;
    //De epoch a formato tradicional de fecha
    const tokenExp: any = new Date(payload * 1000);
    //Tiempo actual
    const now: any = new Date();
    //Calcular 15 min despues del tiempo actual
    now.setTime(now.getTime() + 15 * 60 * 1000);
    if (tokenExp.getTime() < now.getTime()) {
      const body = {
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('refreshToken'),
      };
      this.http
        .post(environment.urlRefreshToken, body)
        .subscribe((resp: any) => {
          //Se captura el idToken y refreshToken
          localStorage.setItem('token', resp.idToken);
          localStorage.setItem('refreshToken', resp.refreshToken);
        });
    }

    return next.handle(request);
  }
}
