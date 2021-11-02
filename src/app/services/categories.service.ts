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

  //TOmar un item de categorias
  public getItem(id: string): Observable<any> {
    return this.http.get(`${environment.urlFirebase}categories/${id}.json`);
  }

  //Guardar informacion de la categoria
  public postData(data: Icategories, token: any): Observable<any> {
    return this.http.post(
      `${environment.urlFirebase}categories.json?auth=${token}`,
      data
    );
  }

  //Actualizar categoria
  public patchData(id: string, data: object, token: any): Observable<any> {
    return this.http.patch(
      `${environment.urlFirebase}categories/${id}.json?auth=${token}`,
      data
    );
  }

  //Eliminar categoria
  public deleteData(id: string, token: any): Observable<any> {
    return this.http.delete(
      `${environment.urlFirebase}categories/${id}.json?auth=${token}`
    );
  }
}
