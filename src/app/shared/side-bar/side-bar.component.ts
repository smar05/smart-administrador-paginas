import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  //FUncion de salida del sistema
  public logout(): void {
    this.loginService.logout();
  }
}
