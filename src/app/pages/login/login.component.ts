import { AlertsPagesService } from './../../services/alerts-pages.service';
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
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

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
    private countService: CountService,
    private alertsPagesService: AlertsPagesService
  ) {}

  ngOnInit(): void {
    this.alertPage();
  }

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

        let count: ICount = await this.countService.getCuentaActual();

        if (!count) {
          alerts.basicAlert('Error', 'No se ha encontrado la cuenta', 'error');
          this.loading = false;
          return;
        }

        //Se captura el localId
        localStorage.setItem(EnumLocalStorage.localId, count.keyCount || '');

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
        //Errores al ingresar
        let error: any = err.code;

        switch (error) {
          case 'auth/invalid-email':
            alerts.basicAlert(
              'Error',
              'El formato del correo electrónico es inválido.',
              'error'
            );
            break;
          case 'auth/user-disabled':
            alerts.basicAlert(
              'Error',
              'La cuenta de usuario está deshabilitada.',
              'error'
            );
            break;
          case 'auth/wrong-password':
            alerts.basicAlert('Error', 'Contraseña incorrecta.', 'error');
            break;
          default:
            alerts.basicAlert('Error', 'Error en el inicio de sesión', 'error');
            break;
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

    let qf: QueryFn = (ref) => ref.where('email', '==', email);
    let resp: IFireStoreRes[] = await this.countService
      .getDataFS(qf)
      .toPromise();

    if (resp) {
      let count: ICount = resp.map(
        (a: IFireStoreRes) =>
          ({
            active: a.data.active,
            activeCount: a.data.activeCount,
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
      if (!count.activeCount) {
        alerts.basicAlert(
          'Usuario inactivo',
          'Su cuenta se encuentra inactiva, contacte a un usuario administrador',
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

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.login)
      .toPromise()
      .then((res: any) => {});
  }
}
