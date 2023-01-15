import { EnumDisputesStatus, Idisputes } from './../../interface/idisputes';
import { EnumMessagesStatus, Imessages } from './../../interface/imessages';
import { IQueryParams } from './../../interface/i-query-params';
import { DisputesService } from './../../services/disputes.service';
import { MessageService } from './../../services/message.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // Mensajes sin responder
  public messages: number = 0;
  // Disputas sin responder
  public disputes: number = 0;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private disputesService: DisputesService
  ) {}

  ngOnInit(): void {
    this.getMessages();
    this.getDisputes();
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl('/login');
  }

  public getMessages(): void {
    let params: IQueryParams = {
      orderBy: '"status"',
      equalTo: `"${EnumMessagesStatus.not_answered}"`,
    };
    this.messageService.getData(params).subscribe((resp: any) => {
      // Contamos solo las que no tienen respuesta
      this.messages = Object.keys(resp)
        .map((a: any) => {
          return { answer: resp[a].answer };
        })
        .filter(
          (a: Imessages) => a.answer == undefined || a.answer == null
        ).length;
    });
  }

  public getDisputes(): void {
    let params: IQueryParams = {
      orderBy: '"status"',
      equalTo: `"${EnumDisputesStatus.not_answered}"`,
    };

    this.disputesService.getData(params).subscribe((resp: any) => {
      // Contamos solo las que no tienen respuesta
      this.disputes = Object.keys(resp)
        .map((a: any) => {
          return { answer: resp[a].answer };
        })
        .filter(
          (a: Idisputes) => a.answer == undefined || a.answer == null
        ).length;
    });
  }
}
