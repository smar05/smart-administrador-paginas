import { map } from 'rxjs/operators';
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
  public disputes: number = 0; // Variable para la cantidad de disputas en el navbar

  constructor(private httpService: HttpService) {}

  /**
   * Se toma la informacion de la coleccion de ordenes en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof DisputesService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlDisputes}.json`, queryParams).pipe(
      map((resp: any) => {
        // Contamos solo las que no tienen respuesta para el icono en el navbar
        this.disputes = Object.keys(resp)
          .map((a: any) => {
            return { answer: resp[a].answer };
          })
          .filter(
            (a: Idisputes) => a.answer == undefined || a.answer == null
          ).length;

        return resp;
      })
    );
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
        } as Idisputes)
    );

    return disputes;
  }
}
