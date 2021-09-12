import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './main-page/home/home.component';
import { UsersComponent } from './main-page/users/users.component';
import { CategoriesComponent } from './main-page/categories/categories.component';
import { SubcategoriesComponent } from './main-page/subcategories/subcategories.component';
import { StoresComponent } from './main-page/stores/stores.component';
import { ProductsComponent } from './main-page/products/products.component';
import { OrdersComponent } from './main-page/orders/orders.component';
import { SalesComponent } from './main-page/sales/sales.component';
import { DisputesComponent } from './main-page/disputes/disputes.component';
import { MessagesComponent } from './main-page/messages/messages.component';

@NgModule({
  declarations: [MainPageComponent, HomeComponent, UsersComponent, CategoriesComponent, SubcategoriesComponent, StoresComponent, ProductsComponent, OrdersComponent, SalesComponent, DisputesComponent, MessagesComponent],
  imports: [CommonModule, SharedModule, AppRoutingModule],
})
export class PagesModule {}
