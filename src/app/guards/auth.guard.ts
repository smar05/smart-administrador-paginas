import { EnumCountPermission } from './../interface/icount';
import { CountService } from './../services/count.service';
import { EnumPages } from './../enums/enum-pages';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EnumLocalStorage } from '../enums/enum-local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private http: HttpClient,
    private countService: CountService
  ) {}

  canActivate(route: ActivatedRouteSnapshot | any): Promise<boolean> {
    return new Promise((resolve) => {
      //Validamos que exista el token
      if (localStorage.getItem(EnumLocalStorage.token) != null) {
        //Validamos que el token sea real
        let body: any = {
          idToken: localStorage.getItem(EnumLocalStorage.token),
        };
        this.http.post(environment.urlGetUser, body).subscribe(
          async (resp: any): Promise<any> => {
            let url: string = route._routerState.url;

            await this.countService.getCuentaActual();

            if (!this.countService.canGoToUrl(url)) {
              this.router.navigateByUrl('/' + EnumPages.home);
            }

            resolve(true);
          },
          (err: any): any => {
            localStorage.removeItem(EnumLocalStorage.token);
            localStorage.removeItem(EnumLocalStorage.refreshToken);
            localStorage.removeItem(EnumLocalStorage.localId);
            this.router.navigateByUrl('/' + EnumPages.login);
            resolve(false);
          }
        );
      } else {
        this.router.navigateByUrl('/' + EnumPages.login);
        resolve(false);
      }
    });
  }
}
