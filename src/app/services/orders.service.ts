import { Iorders } from './../interface/iorders';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private urlOrders: string = environment.collections.orders;

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de ordenes en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlOrders}.json`, queryParams);
  }

  /**
   * Tomar un item de ordenes
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlOrders}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion de la orden
   *
   * @param {Iorders} data
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public postData(data: Iorders): Observable<any> {
    return this.httpService.post(`${this.urlOrders}.json`, data);
  }

  /**
   * Actualizar orden
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlOrders}/${id}.json`, data);
  }

  /**
   * Eliminar orden
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof OrdersService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlOrders}/${id}.json`);
  }
}
