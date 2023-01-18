import { Injectable } from '@angular/core';
import { Ilogin } from '../interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumLocalStorage } from '../enums/enum-local-storage';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  //Autenticacion de firebase
  public login(data: Ilogin): Observable<any> {
    return this.http.post(environment.urlLogin, data).pipe(
      map((resp: any) => {
        //Se captura el idToken y refreshToken
        localStorage.setItem(EnumLocalStorage.token, resp.idToken);
        localStorage.setItem(EnumLocalStorage.refreshToken, resp.refreshToken);

        //Se captura el localId
        localStorage.setItem(EnumLocalStorage.localId, resp.localId);
      })
    );
  }
}
