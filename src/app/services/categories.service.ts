import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Icategories } from './../interface/icategories';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private urlCategories: string = environment.collections.categories;
  private urlImage: string = `${environment.urlStorage.img}/categories`;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private fireStorageService: FireStorageService
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

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion de modelos en categorias
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlCategories, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento de categorias
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof CategoriesService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlCategories, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion de la categoria
   *
   * @param {Icategories} data
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public postDataFS(data: Icategories): Promise<any> {
    return this.fireStorageService.post(this.urlCategories, data);
  }

  /**
   * Actualizar la categoria
   *
   * @param {string} doc
   * @param {Icategories} data
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public patchDataFS(doc: string, data: Icategories): Promise<any> {
    return this.fireStorageService.patch(this.urlCategories, doc, data);
  }

  /**
   * Eliminar categoria
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlCategories, doc);
  }

  //------------ FireStorage---------------//

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
    let url: string = `${this.urlImage}/${name}`;

    return await this.storageService.saveImage(file, url);
  }

  /**
   * Eliminar la imagen de la categoria
   *
   * @param {string} name
   * @return {*}  {Promise<any>}
   * @memberof CategoriesService
   */
  public deleteImage(name: string): Promise<any> {
    let url: string = `${this.urlImage}/${name.split('.')[0]}/${name}`;

    return this.storageService.deleteImage(url);
  }

  /**
   * Eliminar las imagenes de la categoria
   *
   * @param {string} url
   * @return {*}  {Promise<boolean>}
   * @memberof CategoriesService
   */
  public async deleteImages(url: string): Promise<boolean> {
    let complete: boolean = true;
    try {
      let images: any[] = (
        await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
      ).items;

      if (images && images.length > 0) {
        for (const image of images) {
          if (image._location.path) {
            await this.storageService.deleteImage(image._location.path);
          } else {
            continue;
          }
        }
      }
    } catch (error) {
      complete = false;
    }

    return complete;
  }
}
