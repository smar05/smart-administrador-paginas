import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICount } from '../interface/icount';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  private urlCount: string = environment.collections.count;
  private urlFirebase: string = environment.urlFirebaseSinLocalId;

  constructor(private httpService: HttpService, private http: HttpClient) {}

  /**
   * Se toma la informacion de la coleccion de usuarios en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlCount}.json`, queryParams);
  }

  /**
   * Guardar informacion de la cuenta
   *
   * @param {string} id
   * @param {ICount} data
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public postData(id: string, data: ICount): Observable<any> {
    return this.http.post(
      `${this.urlFirebase}${id}/${this.urlCount}.json`,
      data
    );
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
    return this.httpService.patch(`${this.urlCount}/${id}.json`, data);
  }

  /**
   * Eliminar cuenta
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public deleteData(): Observable<any> {
    return this.httpService.delete(`${this.urlCount}.json`);
  }
}
