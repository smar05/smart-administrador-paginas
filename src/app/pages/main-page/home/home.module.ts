import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, GoogleChartsModule],
})
export class HomeModule {}
