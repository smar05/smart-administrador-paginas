import { Error404Component } from './main-page/error404/error404.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { EnumPages } from '../enums/enum-pages';

const routes: Routes = [
  {
    path: EnumPages.login,
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: EnumPages.register,
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: EnumPages.home,
        loadChildren: () =>
          import('./main-page/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: EnumPages.users,
        loadChildren: () =>
          import('./main-page/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: EnumPages.categories,
        loadChildren: () =>
          import('./main-page/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: EnumPages.subcategories,
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
        path: EnumPages.products,
        loadChildren: () =>
          import('./main-page/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: EnumPages.orders,
        loadChildren: () =>
          import('./main-page/orders/orders.module').then(
            (m) => m.OrdersModule
          ),
      },
      {
        path: EnumPages.sales,
        loadChildren: () =>
          import('./main-page/sales/sales.module').then((m) => m.SalesModule),
      },
      {
        path: EnumPages.disputes,
        loadChildren: () =>
          import('./main-page/disputes/disputes.module').then(
            (m) => m.DisputesModule
          ),
      },
      {
        path: EnumPages.messages,
        loadChildren: () =>
          import('./main-page/messages/messages.module').then(
            (m) => m.MessagesModule
          ),
      },
      { path: EnumPages.error, component: Error404Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
