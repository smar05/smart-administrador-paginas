import { IQueryParams } from './../../interface/i-query-params';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
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
    let email: string | null = localStorage.getItem(EnumLocalStorage.email);
    let params: IQueryParams = {
      orderBy: '"email"',
      equalTo: `"${email}"`,
    };

    let res: any = await this.countService.getData(params).toPromise();

    this.myCount = Object.keys(res).map(
      (a: any) =>
        ({
          name: res[a].name,
        } as ICount)
    )[0];
  }
}
