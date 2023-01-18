import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EnumLocalStorage } from '../enums/enum-local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      //Validamos que exista el token
      if (localStorage.getItem(EnumLocalStorage.token) != null) {
        //Validamos que el token sea real
        let body: any = {
          idToken: localStorage.getItem(EnumLocalStorage.token),
        };
        this.http.post(environment.urlGetUser, body).subscribe(
          (resp: any): any => {
            resolve(true);
          },
          (err: any): any => {
            localStorage.removeItem(EnumLocalStorage.token);
            localStorage.removeItem(EnumLocalStorage.refreshToken);
            localStorage.removeItem(EnumLocalStorage.localId);
            this.router.navigateByUrl('/login');
            resolve(false);
          }
        );
      } else {
        this.router.navigateByUrl('/login');
        resolve(false);
      }
    });
  }
}
