import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICount } from '../interface/icount';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  private urlCount: string = environment.collections.count;
  private urlFirebase: string = environment.urlFirebaseSinLocalId;

  constructor(private http: HttpClient) {}

  /**
   * Se toma la informacion de la coleccion de usuarios en Firebase
   *
   * @param {any} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public getData(queryParams: any = {}): Observable<any> {
    return this.http.get(`${this.urlFirebase}${this.urlCount}.json`, {
      params: queryParams,
    });
  }

  /**
   * Tomar un item de cuentas
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public getItem(id: string, queryParams: any = {}): Observable<any> {
    return this.http.get(
      `${this.urlFirebase}${this.urlCount}/${id}.json`,
      queryParams
    );
  }

  /**
   * Guardar informacion de la cuenta
   *
   * @param {ICount} data
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public postData(data: ICount): Observable<any> {
    return this.http.post(`${this.urlFirebase}${this.urlCount}.json`, data);
  }

  /**
   * Actualizar cuenta
   *
   * @param {string} id
   * @param {ICount} data
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public patchData(id: string, data: ICount): Observable<any> {
    return this.http.patch(
      `${this.urlFirebase}${this.urlCount}/${id}.json`,
      data
    );
  }

  /**
   * Eliminar cuenta
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.urlFirebase}${this.urlCount}/${id}.json`);
  }
}
