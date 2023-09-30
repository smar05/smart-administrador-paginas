import { LoginService } from './../../services/login.service';
import { EnumDisputesStatus } from './../../interface/idisputes';
import { EnumMessagesStatus } from './../../interface/imessages';
import { IQueryParams } from './../../interface/i-query-params';
import { DisputesService } from './../../services/disputes.service';
import { MessageService } from './../../services/message.service';
import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public messageService: MessageService,
    public disputesService: DisputesService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getMessages();
    this.getDisputes();
  }

  public logout(): void {
    this.loginService.logout();
  }

  public getMessages(): void {
    let qf: QueryFn = (ref) =>
      ref
        .where('idShop', '==', localStorage.getItem(EnumLocalStorage.localId))
        .where('status', '==', EnumMessagesStatus.not_answered);

    this.messageService
      .getDataFS(qf)
      .toPromise()
      .then((resp: any) => {});
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
