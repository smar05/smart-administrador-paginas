import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private urlApi: string = environment.urlFirebaseSinLocalId + 'shops/';

  constructor(private http: HttpClient) {}

  /**
   * Metodo GET
   *
   * @param {string} endPoint endPoint y QueryParams
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public get(endPoint: string, params: any = {}): Observable<any> {
    params.print = 'pretty';
    return this.http.get(
      `${this.urlApi}${localStorage.getItem(
        EnumLocalStorage.localId
      )}/${endPoint}`,
      { params }
    );
  }

  /**
   * Metodo POST
   *
   * @param {string} endPoint endPoint y QueryParams
   * @param {object} data Datos a guardar
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public post(endPoint: string, data: object): Observable<any> {
    return this.http.post(
      `${this.urlApi}${localStorage.getItem(
        EnumLocalStorage.localId
      )}/${endPoint}`,
      data
    );
  }

  /**
   * Metodo DELETE
   *
   * @param {string} endPoint endPoint y QueryParams
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public delete(endPoint: string): Observable<any> {
    return this.http.delete(
      `${this.urlApi}${localStorage.getItem(
        EnumLocalStorage.localId
      )}/${endPoint}`
    );
  }

  /**
   * Metodo PATCH
   *
   * @param {string} endPoint
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ApiService
   */
  public patch(endPoint: string, data: object): Observable<any> {
    return this.http.patch(
      `${this.urlApi}${localStorage.getItem(
        EnumLocalStorage.localId
      )}/${endPoint}`,
      data
    );
  }
}
