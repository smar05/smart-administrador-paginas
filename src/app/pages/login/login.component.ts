import { CountService } from './../../services/count.service';
import { ICount } from 'src/app/interface/icount';
import { IQueryParams } from './../../interface/i-query-params';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { EnumPages } from './../../enums/enum-pages';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { functions } from '../../helpers/functions';
import { Ilogin } from '../../interface/ilogin';
import { alerts } from '../../helpers/alerts';
import { Router } from '@angular/router';
import '../../shared/spinkit/sk-cube-grid.css';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Creamos grupo de controles
  public f = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  public loading = false;
  formSubmitted: boolean = false; //Valida el formulario

  constructor(
    private form: UntypedFormBuilder,
    private loginService: LoginService,
    private router: Router,
    private countService: CountService
  ) {}

  ngOnInit(): void {}

  public login(): void {
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (this.f.invalid) {
      return;
    }

    //Capturamos la informacion del formulario de la interfaz
    const data: Ilogin = {
      email: this.f.controls.email.value,
      password: this.f.controls.password.value,
      returnSecureToken: true,
    };

    //Servicio de login
    this.loading = true;
    this.loginService
      .loginWithAuthFire(data)
      .then(async (res: any) => {
        if (!res.user.multiFactor.user.emailVerified) {
          alerts.basicAlert(
            'Error',
            'La cuenta no ha sido verificada',
            'error'
          );
          this.loading = false;
          return;
        }

        //Se captura el idToken y refreshToken
        localStorage.setItem(
          EnumLocalStorage.token,
          res.user.multiFactor.user.stsTokenManager.accessToken
        );
        localStorage.setItem(
          EnumLocalStorage.refreshToken,
          res.user.multiFactor.user.stsTokenManager.refreshToken
        );

        //Se captura el localId
        localStorage.setItem(
          EnumLocalStorage.localId,
          res.user.multiFactor.user.uid
        );

        //Se captura el email
        localStorage.setItem(
          EnumLocalStorage.email,
          this.f.controls.email.value
        );

        this.validarUsuarioActivo(this.f.controls.email.value);

        //Entramos al sistema
        this.router.navigateByUrl(EnumPages.home);
        this.loading = false;
      })
      .catch((err: any) => {
        console.error(err);

        //Errores al ingresar
        let error: any = err.error?.errors[0];

        if (error) {
          if (error.message == 'EMAIL_NOT_FOUND') {
            alerts.basicAlert('Error', 'Correo no encontrado', 'error');
          } else if (error.message == 'INVALID_PASSWORD') {
            alerts.basicAlert('Error', 'Contraseña invalida', 'error');
          } else if (error.message == 'INVALID_EMAIL') {
            alerts.basicAlert('Error', 'Correo invalido', 'error');
          } else {
            alerts.basicAlert('Error', 'Ha ocurrido un error', 'error');
          }
        }
        this.loading = false;
      });
  }

  //Validacion
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }

  public async validarUsuarioActivo(email: string): Promise<boolean> {
    if (!email) {
      alerts.basicAlert(
        'Correo invalido',
        'No se ha encontrado el correo',
        'error'
      );
      this.logout();
      return false;
    }

    let params: IQueryParams = {
      orderBy: '"email"',
      equalTo: `"${email}"`,
    };
    let resp: any = await this.countService.getData(params).toPromise();

    if (resp) {
      let count: ICount = Object.keys(resp).map(
        (a: any) =>
          ({
            active: resp[a].active,
          } as ICount)
      )[0];

      if (!count.active) {
        alerts.basicAlert(
          'Usuario inactivo',
          'Su cuenta se encuentra inactiva, contacte a un asesor por favor',
          'error'
        );
        this.logout();
        return false;
      }
    } else {
      alerts.basicAlert(
        'Usuario inactivo',
        'Su cuenta se encuentra inactiva, contacte a un asesor por favor',
        'error'
      );
      this.logout();
      return false;
    }

    return true;
  }

  public logout(): void {
    this.loginService.logout();
  }
}
