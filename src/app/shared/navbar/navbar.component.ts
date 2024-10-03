import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';
import { EnumDisputesStatus } from './../../interface/idisputes';
import { DisputesService } from './../../services/disputes.service';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public disputesService: DisputesService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getDisputes();
  }

  public logout(): void {
    this.loginService.logout();
  }

  public getDisputes(): void {
    // EL conteo de disputas se hace desde el servicio
    let qf: QueryFn = (ref) =>
      ref
        .where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId))
        .where('status', '==', EnumDisputesStatus.not_answered);

    this.disputesService
      .getDataFS(qf)
      .toPromise()
      .then((resp: any) => {});
  }

  public darkMode(e: any): void {
    let body: HTMLBodyElement | null = document.querySelector('body');

    if (e.target.checked) {
      body?.classList.add('dark-mode');
    } else {
      body?.classList.remove('dark-mode');
    }
  }
}
