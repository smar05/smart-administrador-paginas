import { EnumPages } from './../../../enums/enum-pages';
import { AlertsPagesService } from './../../../services/alerts-pages.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css'],
})
export class StoresComponent implements OnInit {
  constructor(private alertsPagesService: AlertsPagesService) {}

  ngOnInit(): void {
    this.alertPage();
  }

  public alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.store)
      .subscribe((res: any) => {});
  }
}
