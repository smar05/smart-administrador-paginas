import { map } from 'rxjs/operators';
import { Imessages } from './../interface/imessages';
import { environment } from 'src/environments/environment';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { FireStorageService } from './fire-storage.service';
import { IFireStoreRes } from '../interface/ifireStoreRes';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private urlMessage: string = environment.collections.messages;
  public messages: number = 0;

  constructor(
    private httpService: HttpService,
    private fireStorageService: FireStorageService
  ) {}

  /**
   * Se toma la informacion de la coleccion de ordenes en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlMessage}.json`, queryParams).pipe(
      map((resp: any) => {
        // Contamos solo las que no tienen respuesta
        this.messages = Object.keys(resp)
          .map((a: any) => {
            return { answer: resp[a].answer };
          })
          .filter((a: any) => a.answer == undefined || a.answer == null).length;

        return resp;
      })
    );
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

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof MessageService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlMessage, qf)
      .pipe(this.fireStorageService.mapForPipe('many'))
      .pipe(
        map((resp: IFireStoreRes[]) => {
          // Contamos solo las que no tienen respuesta
          this.messages = resp
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
   * @memberof MessageService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlMessage, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {Imessages} data
   * @return {*}  {Promise<any>}
   * @memberof MessageService
   */
  public postDataFS(data: Imessages): Promise<any> {
    return this.fireStorageService.post(this.urlMessage, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Imessages} data
   * @return {*}  {Promise<any>}
   * @memberof MessageService
   */
  public patchDataFS(doc: string, data: Imessages): Promise<any> {
    return this.fireStorageService.patch(this.urlMessage, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof MessageService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlMessage, doc);
  }

  //------------ FireStorage---------------//

  // Metodos propios

  /**
   * Se da formato a la respuesta de la bd
   *
   * @param {*} resp
   * @return {*}  {Imessages[]}
   * @memberof MessageService
   */
  public formatMessages(resp: any): Imessages[] {
    let position: number = 1;

    let messages: Imessages[] = resp.map(
      (a: Imessages) =>
        ({
          id: a.id,
          position: position++,
          answer: a.answer,
          date_answer: a.date_answer,
          date_message: a.date_message,
          message: a.message,
          url_product: a.url_product,
          receiver: a.receiver,
          transmitter: a.transmitter,
          status: a.status,
          idShop: a.idShop,
        } as Imessages)
    );

    return messages;
  }
}
