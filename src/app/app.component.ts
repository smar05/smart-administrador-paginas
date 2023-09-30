import { LoginService } from './services/login.service';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertsPagesService } from './services/alerts-pages.service';
import { FireStorageService } from './services/fire-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'INTEGRO-dashboard';

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService,
    private alertsPagesService: AlertsPagesService,
    private fireStorageService: FireStorageService
  ) {}

  ngOnInit(): void {
    this.validarVersionDelAplicativo();
    this.alertPage();
  }

  /**
   * Validacion de la version actual del aplicativo de administracion
   *
   * @memberof AppComponent
   */
  public validarVersionDelAplicativo(): void {
    this.fireStorageService
      .getItem(environment.collections.versions, 'admin')
      .toPromise()
      .then((res) => {
        if (res.data().version != environment.version) {
          alerts.basicAlert(
            'Versión del aplicativo desactualizada',
            `Esta versión del aplicativo: ${
              environment.version
            } no se encuentra actualizada, por favor elimine el cache de su navegador y vuelva a ingresar verificando que se encuentre en la version: ${
              res.data().version
            }`,
            'warning'
          );
          this.loginService.logout();
        }
      });
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage()
      .toPromise()
      .then((res: any) => {});
  }
}
