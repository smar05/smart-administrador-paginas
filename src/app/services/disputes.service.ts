import { Idisputes } from './../interface/idisputes';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DisputesService {
  private urlDisputes: string = environment.collections.disputes;

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de ordenes en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlDisputes}.json`, queryParams);
  }

  /**
   * Tomar un item de ordenes
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlDisputes}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion de la disputa
   *
   * @param {Idisputes} data
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public postData(data: Idisputes): Observable<any> {
    return this.httpService.post(`${this.urlDisputes}.json`, data);
  }

  /**
   * Actualizar disputa
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlDisputes}/${id}.json`, data);
  }

  /**
   * Eliminar disputa
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlDisputes}/${id}.json`);
  }
}
