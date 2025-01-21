import { Component, OnInit } from '@angular/core';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  public logout(): void {
    this.loginService.logout();
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
