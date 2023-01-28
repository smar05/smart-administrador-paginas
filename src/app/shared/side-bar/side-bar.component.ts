import { ICount } from 'src/app/interface/icount';
import { CountService } from './../../services/count.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  public myCount: ICount = {};

  constructor(
    private loginService: LoginService,
    private countService: CountService
  ) {}

  ngOnInit(): void {
    this.getMyCount();
  }

  //FUncion de salida del sistema
  public logout(): void {
    this.loginService.logout();
  }

  public async getMyCount(): Promise<void> {
    this.myCount = await this.countService.getCuentaActual();
  }

  public hasPermission(type: string): boolean | any {
    return this.countService.hasPermission(type);
  }
}
