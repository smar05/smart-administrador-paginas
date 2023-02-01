import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public anioActual!: number;
  public version: string = environment.version;

  constructor() {}

  ngOnInit(): void {
    this.anioActual = new Date().getFullYear();
  }
}
