import { Imessages } from './../interface/imessages';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private urlMessage: string = environment.collections.messages;

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de ordenes en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlMessage}.json`, queryParams);
  }

  /**
   * Tomar un item de messages
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlMessage}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion de la messages
   *
   * @param {Imessages} data
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public postData(data: Imessages): Observable<any> {
    return this.httpService.post(`${this.urlMessage}.json`, data);
  }

  /**
   * Actualizar messages
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlMessage}/${id}.json`, data);
  }

  /**
   * Eliminar messages
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlMessage}/${id}.json`);
  }
}
