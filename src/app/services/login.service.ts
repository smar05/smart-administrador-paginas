import { CountService } from './count.service';
import { ICount } from 'src/app/interface/icount';
import { alerts } from './../helpers/alerts';
import { EnumPages } from './../enums/enum-pages';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Ilogin } from '../interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumLocalStorage } from '../enums/enum-local-storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router,
    private countService: CountService
  ) {}

  //Autenticacion de firebase
  public login(data: Ilogin): Observable<any> {
    return this.http.post(environment.urlLogin, data).pipe(
      map(async (resp: any) => {
        const uid: string = resp.localId;

        let count: ICount = await this.countService.getItem(uid).toPromise();

        if (!count) {
          alerts.basicAlert('Error', 'No se ha encontrado la cuenta', 'error');
          return;
        }

        //Se captura el idToken y refreshToken
        localStorage.setItem(EnumLocalStorage.token, resp.idToken);
        localStorage.setItem(EnumLocalStorage.refreshToken, resp.refreshToken);

        //Se captura el localId
        localStorage.setItem(EnumLocalStorage.localId, uid);
      })
    );
  }

  /**
   *
   *
   * @param {Ilogin} data
   * @return {*}  {Promise<any>}
   * @memberof LoginService
   */
  public loginWithAuthFire(data: Ilogin): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(data.email, data.password);
  }

  /**
   *
   *
   * @memberof LoginService
   */
  public logout(): void {
    localStorage.removeItem(EnumLocalStorage.token);
    localStorage.removeItem(EnumLocalStorage.refreshToken);
    localStorage.removeItem(EnumLocalStorage.localId);
    localStorage.removeItem(EnumLocalStorage.email);
    this.router.navigateByUrl('/' + EnumPages.login);
  }
}
