import { Iproducts } from './../interface/iproducts';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private urlProducts: string = 'products';

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de productos en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlProducts}.json`, queryParams);
  }

  /**
   * Tomar un item de productos
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlProducts}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del producto
   *
   * @param {Iproducts} data
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public postData(data: Iproducts): Observable<any> {
    return this.httpService.post(`${this.urlProducts}.json`, data);
  }

  /**
   * Actualizar producto
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlProducts}/${id}.json`, data);
  }

  /**
   * Eliminar producto
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlProducts}/${id}.json`);
  }
}
