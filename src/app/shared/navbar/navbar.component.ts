import { LoginService } from './../../services/login.service';
import { EnumDisputesStatus } from './../../interface/idisputes';
import { EnumMessagesStatus } from './../../interface/imessages';
import { IQueryParams } from './../../interface/i-query-params';
import { DisputesService } from './../../services/disputes.service';
import { MessageService } from './../../services/message.service';
import { Component, OnInit } from '@angular/core';

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
    let params: IQueryParams = {
      orderBy: '"status"',
      equalTo: `"${EnumMessagesStatus.not_answered}"`,
    };
    this.messageService.getData(params).subscribe((resp: any) => {});
  }

  public getDisputes(): void {
    let params: IQueryParams = {
      orderBy: '"status"',
      equalTo: `"${EnumDisputesStatus.not_answered}"`,
    };

    // EL conteo de disputas se hace desde el servicio
    this.disputesService.getData(params).subscribe((resp: any) => {});
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
