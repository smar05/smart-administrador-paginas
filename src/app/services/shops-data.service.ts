import { Injectable } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FireStorageService } from './fire-storage.service';
import { IStore } from '../interface/istore';

@Injectable({
  providedIn: 'root',
})
export class ShopsDataService {
  private urlShopsData: string = environment.collections.shops_data;

  constructor(private fireStorageService: FireStorageService) {}

  /**
   * Get data
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ShopsDataService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlShopsData, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Post
   *
   * @param {IStore} data
   * @return {*}  {Promise<any>}
   * @memberof ShopsDataService
   */
  public postDataFS(data: IStore): Promise<any> {
    return this.fireStorageService.post(this.urlShopsData, data);
  }

  /**
   * Patch
   *
   * @param {string} doc
   * @param {IStore} data
   * @return {*}  {Promise<any>}
   * @memberof ShopsDataService
   */
  public patchDataFS(doc: string, data: IStore): Promise<any> {
    return this.fireStorageService.patch(this.urlShopsData, doc, data);
  }
}
