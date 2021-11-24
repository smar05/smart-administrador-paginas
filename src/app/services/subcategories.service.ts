import { Isubcategories } from './../interface/isubcategories';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  constructor(private http: HttpClient) {}

  //Tomar datos de subcategorias
  public getData(): Observable<any> {
    return this.http.get(`${environment.urlFirebase}sub-categories.json`);
  }

  //Data filtrada de subcategorias
  public getFilterData(orderBy: string, equalTo: string): Observable<any> {
    return this.http.get(
      `${environment.urlFirebase}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`
    );
  }

  //Obtener un item de la coleccion de subcategorias
  public getItem(id: string): Observable<any> {
    return this.http.get(`${environment.urlFirebase}sub-categories/${id}.json`);
  }

  //Guardar informacion de la subcategoria
  public postData(data: Isubcategories): Observable<any> {
    return this.http.post(
      `${environment.urlFirebase}sub-categories.json`,
      data
    );
  }

  //Actualizar subcategoria
  public patchData(id: string, data: object): Observable<any> {
    return this.http.patch(
      `${environment.urlFirebase}sub-categories/${id}.json`,
      data
    );
  }

  //Eliminar subcategoria
  public deleteData(id: string): Observable<any> {
    return this.http.delete(
      `${environment.urlFirebase}sub-categories/${id}.json`
    );
  }
}
