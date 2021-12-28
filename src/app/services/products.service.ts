import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(public http: HttpClient) {}

  //Todos los productos de la coleccion
  public getData(): Observable<any> {
    return this.http.get(`${environment.urlFirebase}products.json`);
  }

  //Data filtrada de productos
  public getFilterData(orderBy: string, equalTo: string): Observable<any> {
    return this.http.get(
      `${environment.urlFirebase}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`
    );
  }

  //Obtener un producto
  public getItem(id: string): Observable<any> {
    return this.http.get(`${environment.urlFirebase}products/${id}.json`);
  }
}
