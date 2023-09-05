import { Isales } from './../interface/isales';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private urlSales: string = environment.collections.sales;

  constructor(
    private httpService: HttpService,
    private fireStorageService: FireStorageService
  ) {}

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

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlSales, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof SalesService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlSales, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {Isales} data
   * @return {*}  {Promise<any>}
   * @memberof SalesService
   */
  public postDataFS(data: Isales): Promise<any> {
    return this.fireStorageService.post(this.urlSales, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Isales} data
   * @return {*}  {Promise<any>}
   * @memberof SalesService
   */
  public patchDataFS(doc: string, data: Isales): Promise<any> {
    return this.fireStorageService.patch(this.urlSales, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof SalesService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlSales, doc);
  }

  //------------ FireStorage---------------//
}
