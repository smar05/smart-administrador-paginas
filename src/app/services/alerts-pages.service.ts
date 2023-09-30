import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { alerts } from 'src/app/helpers/alerts';
import {
  EnumAlertsPagesIdApplication,
  IAlertsPages,
} from './../interface/ialerts-pages';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryFn } from '@angular/fire/compat/firestore';
import { FireStorageService } from './fire-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AlertsPagesService {
  constructor(private fireStorageService: FireStorageService) {}

  /**
   * Alertas por paginas
   *
   * @param {string} page
   * @memberof AlertsPagesService
   */
  public alertPage(page: string = ''): Observable<any> {
    let qf: QueryFn = (qf) =>
      qf
        .where('active', '==', true)
        .where('page', '==', page)
        .where('idApplication', '==', EnumAlertsPagesIdApplication.ADMIN)
        .limit(1);

    return this.fireStorageService
      .getData(environment.collections.alerts, qf)
      .pipe(
        map((res: any) => {
          if (res && res.docs.length > 0) {
            let alerta: IAlertsPages = res.docs.map((a: any) => {
              return a.data();
            })[0];

            alerts.basicAlert(alerta.title, alerta.text, alerta.icon);
          }
        })
      );
  }
}
