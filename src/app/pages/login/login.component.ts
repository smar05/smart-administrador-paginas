import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { functions } from '../../helpers/functions';
import { Ilogin } from '../../interface/ilogin';
import { alerts } from '../../helpers/alerts';
import { Router } from '@angular/router';

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
    private router: Router
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

    //Srvicio de login
    this.loading = true;
    this.loginService.login(data).subscribe(
      (resp: any) => {
        //Entramos al sistema
        this.router.navigateByUrl('/');
        this.loading = false;
      },
      (err: any) => {
        //Errores al ingresar
        if (err.error.error.message == 'EMAIL_NOT_FOUND') {
          alerts.basicAlert('Error', 'Email not found', 'error');
        } else if (err.error.error.message == 'INVALID_PASSWORD') {
          alerts.basicAlert('Error', 'Invalid password', 'error');
        } else if (err.error.error.message == 'INVALID_EMAIL') {
          alerts.basicAlert('Error', 'Invalid email', 'error');
        } else {
          alerts.basicAlert('Error', 'An error occurred', 'error');
        }
        this.loading = false;
      }
    );
  }

  //Validacion
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
