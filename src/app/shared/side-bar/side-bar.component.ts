import { EnumPages } from './../../enums/enum-pages';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnumLocalStorage } from 'src/app/enums/enum-local-storage';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  //FUncion de salida del sistema
  public logout(): void {
    localStorage.removeItem(EnumLocalStorage.token);
    localStorage.removeItem(EnumLocalStorage.refreshToken);
    localStorage.removeItem(EnumLocalStorage.localId);
    this.router.navigateByUrl('/' + EnumPages.login);
  }
}
