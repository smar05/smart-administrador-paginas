import { ICities } from './../interface/icities';
import { IState } from './../interface/istate';
import { ICountries } from './../interface/icountries';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private urlLocation: string = environment.urlLocation;
  private apiKeyLocation: string = environment.apiKeyLocation;
  private headers: Headers = new Headers();

  constructor() {
    this.headers.append('X-CSCAPI-KEY', this.apiKeyLocation);
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  /**
   * Consulta de todos los paises
   *
   * @return {*}  {Promise<ICountries[]>}
   * @memberof LocationService
   */
  public getAllContries(): Promise<ICountries[]> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    return fetch(`${this.urlLocation}countries`, requestOptions)
      .then((response: any) => response.json())
      .catch((err: any) => {
        console.error(err);
      });
  }

  /**
   * Todos los estados por pais
   *
   * @param {string} iso Iso del pais
   * @return {*}  {Promise<IState[]>}
   * @memberof LocationService
   */
  public getAllStatesByCountry(iso: string): Promise<IState[]> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    return fetch(`${this.urlLocation}countries/${iso}/states`, requestOptions)
      .then((response: any) => response.json())
      .catch((err: any) => {
        console.error(err);
      });
  }

  /**
   * Todas las ciudades por pais y estado
   *
   * @param {string} isoCountry Iso del pais
   * @param {string} isoState Iso del estado
   * @return {*}  {Promise<ICities[]>}
   * @memberof LocationService
   */
  public getAllCitiesByCountryAndState(
    isoCountry: string,
    isoState: string
  ): Promise<ICities[]> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    return fetch(
      `${this.urlLocation}countries/${isoCountry}/states/${isoState}/cities`,
      requestOptions
    )
      .then((response: any) => response.json())
      .catch((err: any) => {
        console.error(err);
      });
  }
}
