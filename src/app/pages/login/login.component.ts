import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { functions } from '../../helpers/functions';
import { Ilogin } from '../../interface/ilogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public f = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  formSubmitted: boolean = false;

  constructor(private form: FormBuilder, private loginService: LoginService) {}

  ngOnInit(): void {}

  public login(): void {
    this.formSubmitted = true;

    const data: Ilogin = {
      email: this.f.controls.email.value,
      password: this.f.controls.password.value,
      returnSecureToken: true,
    };
    this.loginService.login(data).subscribe(
      (resp) => {
        console.log(resp);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
