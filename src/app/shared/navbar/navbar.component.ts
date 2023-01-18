import { EnumPages } from './../../enums/enum-pages';
import { EnumDisputesStatus, Idisputes } from './../../interface/idisputes';
import { EnumMessagesStatus, Imessages } from './../../interface/imessages';
import { IQueryParams } from './../../interface/i-query-params';
import { DisputesService } from './../../services/disputes.service';
import { MessageService } from './../../services/message.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    public messageService: MessageService,
    public disputesService: DisputesService
  ) {}

  ngOnInit(): void {
    this.getMessages();
    this.getDisputes();
  }

  public logout(): void {
    localStorage.removeItem(EnumLocalStorage.token);
    localStorage.removeItem(EnumLocalStorage.refreshToken);
    localStorage.removeItem(EnumLocalStorage.localId);
    this.router.navigateByUrl('/' + EnumPages.login);
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
