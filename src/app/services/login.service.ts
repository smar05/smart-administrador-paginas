import { Injectable } from '@angular/core';
import { Ilogin } from '../interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  public login(data: Ilogin): Observable<any> {
    return this.http.post(environment.urlLogin, data);
  }
}
