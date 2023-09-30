import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Isubcategories } from './../interface/isubcategories';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  private urlSubCategories: string = environment.collections.subCategories;

  constructor(
    private httpService: HttpService,
    private fireStorageService: FireStorageService
  ) {}

  /**
   * Se toma la informacion de la coleccion de subcategorias en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlSubCategories}.json`, queryParams);
  }

  /**
   * Tomar un item de subcategorias
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(
      `${this.urlSubCategories}/${id}.json`,
      queryParams
    );
  }

  /**
   * Guardar informacion de subcategorias
   *
   * @param {Icategories} data
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public postData(data: Isubcategories): Observable<any> {
    return this.httpService.post(`${this.urlSubCategories}.json`, data);
  }

  /**
   * Actualizar subcategoria
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlSubCategories}/${id}.json`, data);
  }

  /**
   * Eliminar subcategoria
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlSubCategories}/${id}.json`);
  }

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlSubCategories, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SubcategoriesService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlSubCategories, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {Isubcategories} data
   * @return {*}  {Promise<any>}
   * @memberof SubcategoriesService
   */
  public postDataFS(data: Isubcategories): Promise<any> {
    return this.fireStorageService.post(this.urlSubCategories, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Isubcategories} data
   * @return {*}  {Promise<any>}
   * @memberof SubcategoriesService
   */
  public patchDataFS(doc: string, data: Isubcategories): Promise<any> {
    return this.fireStorageService.patch(this.urlSubCategories, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof SubcategoriesService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlSubCategories, doc);
  }

  //------------ FireStorage---------------//
}
