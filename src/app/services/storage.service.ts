import {
  Storage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from '@angular/fire/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  /**
   *
   *
   * @param {string} url
   * @return {*}  {Promise<any>}
   * @memberof StorageService
   */
  public getStorageListAll(url: string): Promise<any> {
    const imgRef = ref(this.storage, url);
    return listAll(imgRef);
  }

  /**
   * Obtiene la url de descarga de la imagen
   *
   * @param {*} image
   * @return {*}  {Promise<string>}
   * @memberof StorageService
   */
  public getDownloadURL(image: any): Promise<string> {
    return getDownloadURL(image);
  }

  /**
   *  Guardar una imagen
   *
   * @param {File} file
   * @param {string} url
   * @return {*}  {Promise<any>}
   * @memberof StorageService
   */
  public saveImage(file: File, url: string): Promise<any> {
    const imgRef = ref(this.storage, url);

    return uploadBytes(imgRef, file);
  }
}
