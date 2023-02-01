import { EnumCountPermission } from 'src/app/interface/icount';
import { EnumPages } from './../enums/enum-pages';
import { EnumLocalStorage } from './../enums/enum-local-storage';
import { IQueryParams } from './../interface/i-query-params';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICount } from '../interface/icount';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CountService {
  private urlCount: string = environment.collections.counts;
  private urlFirebase: string = environment.urlFirebaseSinLocalId;
  private cuentaActual: ICount = {};

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Se toma la informacion de la coleccion de usuarios en Firebase
   *
   * @param {any} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public getData(queryParams: any = {}): Observable<any> {
    return this.http.get(`${this.urlFirebase}${this.urlCount}.json`, {
      params: queryParams,
    });
  }

  /**
   * Tomar un item de cuentas
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public getItem(id: string, queryParams: any = {}): Observable<any> {
    return this.http.get(
      `${this.urlFirebase}${this.urlCount}/${id}.json`,
      queryParams
    );
  }

  /**
   * Guardar informacion de la cuenta
   *
   * @param {ICount} data
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public postData(data: ICount): Observable<any> {
    return this.http.post(`${this.urlFirebase}${this.urlCount}.json`, data);
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
    return this.http.patch(
      `${this.urlFirebase}${this.urlCount}/${id}.json`,
      data
    );
  }

  /**
   * Eliminar cuenta
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CountService
   */
  public deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.urlFirebase}${this.urlCount}/${id}.json`);
  }

  // Metodos propios ///////////////////////////////////////////////////////////////

  /**
   * Metodo para obtener la cuenta actual
   *
   * @return {*}  {Promise<ICount>}
   * @memberof CountService
   */
  public async getCuentaActual(): Promise<ICount> {
    if (this.cuentaActual.id) return this.cuentaActual;

    let email: string = localStorage.getItem(EnumLocalStorage.email) || '';

    if (!email) {
      localStorage.removeItem(EnumLocalStorage.token);
      localStorage.removeItem(EnumLocalStorage.refreshToken);
      localStorage.removeItem(EnumLocalStorage.localId);
      localStorage.removeItem(EnumLocalStorage.email);
      this.router.navigateByUrl('/' + EnumPages.login);
      return {};
    }

    let params: IQueryParams = {
      orderBy: '"email"',
      equalTo: `"${email}"`,
    };

    let res2: any = await this.getData(params).toPromise();
    let idCount: any = Object.keys(res2)[0];
    let count: ICount = res2[Object.keys(res2)[0]];
    count.id = idCount;
    if (count.permission != EnumCountPermission.admin)
      count.permission = JSON.parse(count.permission);
    this.cuentaActual = count;

    return this.cuentaActual;
  }

  /**
   * Retorna el permiso
   *
   * @param {string} type tipo de permiso
   * @return {*}  {boolean}
   * @memberof CountService
   */
  public hasPermission(type: string): boolean {
    // Si no hay una cuenta
    if (!this.cuentaActual.id) return false;

    if (this.cuentaActual.permission == EnumCountPermission.admin) return true;

    return this.cuentaActual.permission[type];
  }

  /**
   * Determina si la cuenta puede acceder a la url
   *
   * @param {string} allUrl
   * @return {*}  {boolean}
   * @memberof CountService
   */
  public canGoToUrl(allUrl: string): boolean {
    let urls: string[] = allUrl
      .split('/')
      .filter((a: string) => !(a == '' || a == '/'));
    let valido = true;

    for (const url of urls) {
      switch (url) {
        case environment.collections.categories:
          valido = this.hasPermission(EnumCountPermission.categories_read);
          break;

        case environment.collections.disputes:
          valido = this.hasPermission(EnumCountPermission.disputes_read);
          break;

        case environment.collections.messages:
          valido = this.hasPermission(EnumCountPermission.messages_read);
          break;

        case environment.collections.orders:
          valido = this.hasPermission(EnumCountPermission.orders_read);
          break;

        case environment.collections.products:
          valido = this.hasPermission(EnumCountPermission.products_read);
          break;

        case environment.collections.sales:
          valido = this.hasPermission(EnumCountPermission.sales_read);
          break;

        case environment.collections.subCategories:
          valido = this.hasPermission(EnumCountPermission.subcategories_read);
          break;

        case environment.collections.users:
          valido = this.hasPermission(EnumCountPermission.users_read);
          break;

        case environment.collections.store:
          valido = this.hasPermission(EnumCountPermission.store_read);
          break;

        case environment.collections.counts:
          valido = true; // Todas las cuentas pueden acceder a mi cuenta, dentro de la pagina se le restringen los permisos
          break;

        case environment.urls_program.edit_product:
          valido = this.hasPermission(EnumCountPermission.products_write);
          break;

        case environment.urls_program.new_product:
          valido = this.hasPermission(EnumCountPermission.products_write);
          break;

        default:
          valido = false;
          break;
      }

      if (!valido) break;
    }

    return valido;
  }

  /**
   *
   *
   * @param {ICount} cuenta
   * @memberof CountService
   */
  public setCuentaActual(cuenta: ICount): void {
    this.cuentaActual = cuenta;
  }
}
