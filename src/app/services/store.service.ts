import { IStore } from './../interface/istore';
import { Observable } from 'rxjs';
import { IQueryParams } from './../interface/i-query-params';
import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private urlStore: string = environment.collections.stores;
  private urlImage: string = `${environment.urlStorage.img}/store`;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private fireStorageService: FireStorageService
  ) {}

  /**
   * Se toma la informacion de la coleccion de store en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlStore}.json`, queryParams);
  }

  /**
   * Tomar un item de store
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlStore}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del store
   *
   * @param {Icategories} data
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public postData(data: IStore): Observable<any> {
    return this.httpService.post(`${this.urlStore}.json`, data);
  }

  /**
   * Actualizar categstoreoria
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlStore}/${id}.json`, data);
  }

  /**
   * Eliminar store
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlStore}/${id}.json`);
  }

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlStore, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof StoreService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlStore, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {IStore} data
   * @return {*}  {Promise<any>}
   * @memberof StoreService
   */
  public postDataFS(data: IStore): Promise<any> {
    return this.fireStorageService.post(this.urlStore, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {IStore} data
   * @return {*}  {Promise<any>}
   * @memberof StoreService
   */
  public patchDataFS(doc: string, data: IStore): Promise<any> {
    return this.fireStorageService.patch(this.urlStore, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof StoreService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlStore, doc);
  }

  //------------ FireStorage---------------//

  //Storage//////////////////////
  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string>}
   * @memberof StoreService
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
   *  Guardar la imagen de store
   *
   * @param {File} file
   * @param {string} name
   * @return {*}  {Promise<any>}
   * @memberof StoreService
   */
  public async saveImage(file: File, name: string): Promise<any> {
    let url: string = `${this.urlImage}/${name}`;

    return await this.storageService.saveImage(file, url);
  }

  /**
   * Eliminar la imagen de la store
   *
   * @param {string} name
   * @return {*}  {Promise<any>}
   * @memberof StoreService
   */
  public deleteImage(name: string): Promise<any> {
    let url: string = `${this.urlImage}/${name.split('.')[0]}/${name}`;

    return this.storageService.deleteImage(url);
  }

  /**
   * Eliminar las imagenes de la store
   *
   * @param {string} url
   * @return {*}  {Promise<boolean>}
   * @memberof StoreService
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
