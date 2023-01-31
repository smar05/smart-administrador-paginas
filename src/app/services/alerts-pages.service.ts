import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';
import { IAlertsPages } from './../interface/ialerts-pages';
import { HttpClient } from '@angular/common/http';
import { IQueryParams } from './../interface/i-query-params';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertsPagesService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Alertas por paginas
   *
   * @param {string} page
   * @memberof AlertsPagesService
   */
  public alertPage(page: string = ''): Observable<any> {
    let url: string = `${environment.urlFirebaseSinLocalId}`;
    let params: IQueryParams | any = {
      orderBy: '"active"',
      equalTo: true,
    };

    if (page) {
      url += `${environment.aplications.admin.alerts.url}${page}.json`;
    } else {
      url += `${environment.aplications.admin.alerts.allPages}.json`;
    }

    return this.httpClient.get(url, { params }).pipe(
      map((res: any) => {
        if (res && Object.keys(res).length > 0) {
          let alerta: IAlertsPages = Object.keys(res).map((a: any) => {
            return res[a];
          })[0];

          alerts.basicAlert(alerta.title, alerta.text, alerta.icon);
        }
      })
    );
  }
}
