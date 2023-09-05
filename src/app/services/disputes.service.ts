import { map } from 'rxjs/operators';
import { Idisputes } from './../interface/idisputes';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from '../interface/ifireStoreRes';

@Injectable({
  providedIn: 'root',
})
export class DisputesService {
  private urlDisputes: string = environment.collections.disputes;
  public disputes: number = 0; // Variable para la cantidad de disputas en el navbar

  constructor(
    private httpService: HttpService,
    private fireStorageService: FireStorageService
  ) {}

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

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlDisputes, qf)
      .pipe(this.fireStorageService.mapForPipe('many'))
      .pipe(
        map((resp: IFireStoreRes[]) => {
          // Contamos solo las que no tienen respuesta para el icono en el navbar
          this.disputes = resp
            .map((a: IFireStoreRes) => {
              return { answer: a.data.answer };
            })
            .filter(
              (a: IFireStoreRes | any) =>
                a.data.answer == undefined || a.data.answer == null
            ).length;

          return resp;
        })
      );
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlDisputes, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {Idisputes} data
   * @return {*}  {Promise<any>}
   * @memberof DisputesService
   */
  public postDataFS(data: Idisputes): Promise<any> {
    return this.fireStorageService.post(this.urlDisputes, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Idisputes} data
   * @return {*}  {Promise<any>}
   * @memberof DisputesService
   */
  public patchDataFS(doc: string, data: Idisputes): Promise<any> {
    return this.fireStorageService.patch(this.urlDisputes, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof DisputesService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlDisputes, doc);
  }

  //------------ FireStorage---------------//

  // Metodos propios

  /**
   * Dar formato a la respuesta de la bd
   *
   * @param {*} resp
   * @return {*}  {Idisputes[]}
   * @memberof DisputesService
   */
  public formatDisputes(resp: any): Idisputes[] {
    let position: number = 1;

    let disputes: Idisputes[] = Object.keys(resp).map(
      (a) =>
        ({
          id: a,
          position: position++,
          answer: resp[a].answer,
          date_answer: resp[a].date_answer,
          date_dispute: resp[a].date_dispute,
          message: resp[a].message,
          order: resp[a].order,
          receiver: resp[a].receiver,
          transmitter: resp[a].transmitter,
          status: resp[a].status,
          idShop: resp[a].idShop,
        } as Idisputes)
    );

    return disputes;
  }
}
