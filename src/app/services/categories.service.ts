import { Icategories } from './../interface/icategories';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  //Se toma la informacion de la coleccion de Categorias en Firebase
  public getData(): Observable<any> {
    return this.http.get(`${environment.urlFirebase}categories.json`);
  }

  //Data filtrada de categorias
  public getFilterData(orderBy: string, equalTo: string): Observable<any> {
    return this.http.get(
      `${environment.urlFirebase}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`
    );
  }

  //Guardar informacion de la categoria
  public postData(data: Icategories, token: any): Observable<any> {
    return this.http.post(
      `${environment.urlFirebase}categories.json?auth=${token}`,
      data
    );
  }
}
