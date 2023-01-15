import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Iproducts } from './../interface/iproducts';
import { IQueryParams } from './../interface/i-query-params';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private urlProducts: string = environment.collections.products;
  private urlImage: string = `${environment.urlStorage.img}/products`;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService
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
    let products: Iproducts[] = Object.keys(array).map(
      (a) =>
        ({
          id: a,
          position: position--,
          category: array[a].category,
          date_created: array[a].date_created,
          default_banner: array[a].default_banner,
          delivery_time: array[a].delivery_time,
          description: array[a].description,
          details: JSON.parse(array[a].details),
          feedback: JSON.parse(array[a].feedback),
          horizontal_slider: JSON.parse(array[a].horizontal_slider),
          name: array[a].name,
          offer: array[a].offer,
          price: array[a].price,
          reviews: JSON.parse(array[a].reviews),
          sales: array[a].sales,
          shipping: array[a].shipping,
          specification: array[a].specification
            ? JSON.parse(array[a].specification)
            : [],
          stock: array[a].stock,
          store: array[a].store,
          sub_category: array[a].sub_category,
          summary: JSON.parse(array[a].summary),
          tags: array[a].tags,
          title_list: array[a].title_list,
          top_banner: JSON.parse(array[a].top_banner),
          url: array[a].url,
          vertical_slider: array[a].vertical_slider,
          video: JSON.parse(array[a].video),
          views: array[a].views,
          gallery: array[a].gallery,
          delete: array[a].delete,
        } as Iproducts)
    );

    return products;
  }
}
