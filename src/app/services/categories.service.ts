import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
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
  private urlImage: string = `${environment.urlStorage.img}/categories`;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService
  ) {}

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
   * @memberof CategoriesService
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
   * @memberof CategoriesService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlCategories}/${id}.json`, data);
  }

  /**
   * Eliminar categoria
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlCategories}/${id}.json`);
  }

  //Storage//////////////////////
  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string>}
   * @memberof CategoriesService
   */
  public async getImage(url: string): Promise<string> {
    let image: any = (
      await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
    ).items[0];

    if (image) {
      return await this.storageService.getDownloadURL(image);
    }

    return '';
  }

  /**
   *  Guardar la imagen de categoria
   *
   * @param {File} file
   * @param {string} name
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public async saveImage(file: File, name: string): Promise<any> {
    let url: string = `${this.urlImage}/${name.split('.')[0]}/${name}`;

    return await this.storageService.saveImage(file, url);
  }
}
