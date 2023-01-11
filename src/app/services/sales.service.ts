import { Isales } from './../interface/isales';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private urlSales: string = environment.collections.sales;

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de ordenes en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlSales}.json`, queryParams);
  }

  /**
   * Tomar un item de sales
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlSales}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion de la sales
   *
   * @param {Isales} data
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public postData(data: Isales): Observable<any> {
    return this.httpService.post(`${this.urlSales}.json`, data);
  }

  /**
   * Actualizar sales
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlSales}/${id}.json`, data);
  }

  /**
   * Eliminar sales
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlSales}/${id}.json`);
  }
}
