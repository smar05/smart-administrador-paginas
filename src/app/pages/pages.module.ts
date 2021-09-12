import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './main-page/home/home.component';
import { UsersComponent } from './main-page/users/users.component';
import { CategoriesComponent } from './main-page/categories/categories.component';

@NgModule({
  declarations: [MainPageComponent, HomeComponent, UsersComponent, CategoriesComponent],
  imports: [CommonModule, SharedModule, AppRoutingModule],
})
export class PagesModule {}
