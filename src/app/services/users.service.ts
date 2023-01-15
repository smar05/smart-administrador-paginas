import { environment } from 'src/environments/environment';
import { Iusers } from './../interface/iusers';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlUsers: string = environment.collections.users;

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de usuarios en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlUsers}.json`, queryParams);
  }

  /**
   * Tomar un item de usuarios
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlUsers}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del usuario
   *
   * @param {Iusers} data
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public postData(data: Iusers): Observable<any> {
    return this.httpService.post(`${this.urlUsers}.json`, data);
  }

  /**
   * Actualizar usuario
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlUsers}/${id}.json`, data);
  }

  /**
   * Eliminar usuario
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlUsers}/${id}.json`);
  }
}
