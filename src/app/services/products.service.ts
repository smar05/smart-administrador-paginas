import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Iproducts } from './../interface/iproducts';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FireStorageService } from './fire-storage.service';
import { QueryFn } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private urlProducts: string = environment.collections.products;
  private urlImage: string = `${environment.urlStorage.img}/products`;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private fireStorageService: FireStorageService
  ) {}

  /**
   * Se toma la informacion de la coleccion de productos en Firebase
   *
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public getData(queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlProducts}.json`, queryParams);
  }

  /**
   * Tomar un item de productos
   *
   * @param {string} id
   * @param {IQueryParams} [queryParams={}]
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public getItem(id: string, queryParams: IQueryParams = {}): Observable<any> {
    return this.httpService.get(`${this.urlProducts}/${id}.json`, queryParams);
  }

  /**
   * Guardar informacion del producto
   *
   * @param {Iproducts} data
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public postData(data: Iproducts): Observable<any> {
    return this.httpService.post(`${this.urlProducts}.json`, data);
  }

  /**
   * Actualizar producto
   *
   * @param {string} id
   * @param {object} data
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public patchData(id: string, data: object): Observable<any> {
    return this.httpService.patch(`${this.urlProducts}/${id}.json`, data);
  }

  /**
   * Eliminar producto
   *
   * @param {string} id
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public deleteData(id: string): Observable<any> {
    return this.httpService.delete(`${this.urlProducts}/${id}.json`);
  }

  //------------ FireStorage---------------//
  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlProducts, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ProductsService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlProducts, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {Iproducts} data
   * @return {*}  {Promise<any>}
   * @memberof ProductsService
   */
  public postDataFS(data: Iproducts): Promise<any> {
    return this.fireStorageService.post(this.urlProducts, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Iproducts} data
   * @return {*}  {Promise<any>}
   * @memberof ProductsService
   */
  public patchDataFS(doc: string, data: Iproducts): Promise<any> {
    return this.fireStorageService.patch(this.urlProducts, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof ProductsService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlProducts, doc);
  }

  //------------ FireStorage---------------//

  //Storage//////////////////////
  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string>}
   * @memberof ProductsService
   */
  public async getImage(url: string): Promise<string> {
    let image: any = (
      await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
    ).items[0];

    if (image) {
      return this.storageService.getDownloadURL(image);
    }

    return '';
  }

  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<string[]>}
   * @memberof ProductsService
   */
  public async getImages(url: string): Promise<string[]> {
    let images: any[] = (
      await this.storageService.getStorageListAll(`${this.urlImage}/${url}`)
    ).items;

    if (images) {
      let imagesUrl: string[] = [];
      for (const image of images) {
        imagesUrl.push(await this.storageService.getDownloadURL(image));
      }
      return imagesUrl;
    }

    return [];
  }

  /**
   *  Guardar la imagen de producto
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
   * Eliminar la imagen del producto
   *
   * @param {string} name
   * @return {*}  {Promise<any>}
   * @memberof ProductsService
   */
  public deleteImage(name: string): Promise<any> {
    let url: string = `${this.urlImage}/${name}`;

    return this.storageService.deleteImage(url);
  }

  /**
   * Eliminar las imagenes del producto
   *
   * @param {string} url
   * @return {*}  {Promise<boolean>}
   * @memberof ProductsService
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

  /**
   * Dar formato a la respusta de productos
   *
   * @param {*} array
   * @return {*}  {Iproducts[]}
   * @memberof ProductsService
   */
  public formatProducts(array: any): Iproducts[] {
    let position: number = Object.keys(array).length;
    let products: Iproducts[] = array.map(
      (a: Iproducts) =>
        ({
          id: a.id,
          position: position--,
          category: a.category,
          date_created: a.date_created,
          date_updated: a.date_updated,
          delivery_time: a.delivery_time,
          description: a.description,
          details: a.details ? JSON.parse(a.details) : null,
          feedback: a.feedback,
          name: a.name,
          offer: a.offer,
          price: a.price,
          reviews: a.reviews ? JSON.parse(a.reviews) : null,
          sales: a.sales,
          shipping: a.shipping,
          specification: a.specification ? JSON.parse(a.specification) : null,
          stock: a.stock,
          sub_category: a.sub_category,
          summary: a.summary ? JSON.parse(a.summary) : null,
          tags: a.tags,
          title_list: a.title_list,
          url: a.url,
          video: a.video ? JSON.parse(a.video) : null,
          views: a.views,
          gallery: a.gallery,
          delete: a.delete,
          idShop: a.idShop,
        } as Iproducts)
    );

    return products;
  }

  /**
   * Modifica el producto para guardarlo en DB
   *
   * @param {Iproducts} producto
   * @return {*}  {Iproducts}
   * @memberof ProductsService
   */
  public dataToSave(producto: Iproducts): Iproducts {
    let returnData: Iproducts = producto;
    returnData.feedback = producto.feedback;
    delete returnData.id;
    returnData.details = JSON.stringify(producto.details);
    returnData.reviews = JSON.stringify(producto.reviews);
    returnData.specification = JSON.stringify(producto.specification);
    returnData.summary = JSON.stringify(producto.summary);
    returnData.video = JSON.stringify(producto.video);

    returnData.date_updated = new Date();

    return returnData;
  }
}
