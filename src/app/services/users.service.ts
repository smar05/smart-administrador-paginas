import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  //Se toma la informacion de la coleccion de usuarios en Firebase
  public getData(): Observable<any> {
    return this.http.get(`${environment.urlFirebase}users.json`);
  }
}
