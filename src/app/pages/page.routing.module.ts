import { MessagesComponent } from './main-page/messages/messages.component';
import { DisputesComponent } from './main-page/disputes/disputes.component';
import { SalesComponent } from './main-page/sales/sales.component';
import { OrdersComponent } from './main-page/orders/orders.component';
import { ProductsComponent } from './main-page/products/products.component';
import { StoresComponent } from './main-page/stores/stores.component';
import { SubcategoriesComponent } from './main-page/subcategories/subcategories.component';
import { CategoriesComponent } from './main-page/categories/categories.component';
import { UsersComponent } from './main-page/users/users.component';
//import { HomeComponent } from './main-page/home/home.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./main-page/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./main-page/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./main-page/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'subcategories',
        loadChildren: () =>
          import('./main-page/subcategories/subcategories.module').then(
            (m) => m.SubcategoriesModule
          ),
      },
      {
        path: 'stores',
        loadChildren: () =>
          import('./main-page/stores/stores.module').then(
            (m) => m.StoresModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./main-page/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./main-page/orders/orders.module').then(
            (m) => m.OrdersModule
          ),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./main-page/sales/sales.module').then((m) => m.SalesModule),
      },
      {
        path: 'disputes',
        loadChildren: () =>
          import('./main-page/disputes/disputes.module').then(
            (m) => m.DisputesModule
          ),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./main-page/messages/messages.module').then(
            (m) => m.MessagesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
