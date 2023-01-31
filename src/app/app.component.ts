import { LoginService } from './services/login.service';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'INTEGRO-dashboard';
  private urlVersionAdmin: string = `${environment.urlFirebaseSinLocalId}${environment.aplications.admin.version}.json`;

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.validarVersionDelAplicativo();
  }

  /**
   * Validacion de la version actual del aplicativo de administracion
   *
   * @memberof AppComponent
   */
  public validarVersionDelAplicativo(): void {
    this.httpClient.get(this.urlVersionAdmin).subscribe(
      (res: string | any) => {
        if (res != environment.version) {
          alerts.basicAlert(
            'Versión del aplicativo desactualizada',
            `Esta versión del aplicativo: ${environment.version} no se encuentra actualizada, por favor elimine el cache de su navegador y vuelva a ingresar verificando que se encuentre en la version: ${res}`,
            'warning'
          );
          this.loginService.logout();
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
