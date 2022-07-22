import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Icategories } from './../interface/icategories';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private urlCategories: string = 'categories';

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de categorias en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlCategories}.json`, queryParams);
  }

  /**
   * Tomar un item de categorias
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(
      `${this.urlCategories}/${id}.json`,
      queryParams
    );
  }

  /**
   * Guardar informacion del categorias
   *
   * @param {Icategories} data
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public postData(data: Icategories): Observable<any> {
    return this.httpService.post(`${this.urlCategories}.json`, data);
  }

  /**
   * Actualizar categoria
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlCategories}/${id}.json`, data);
  }

  /**
   * Eliminar categoria
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof ModelsService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlCategories}/${id}.json`);
  }
}
