import { SubcategoriesComponent } from './pages/main-page/subcategories/subcategories.component';
import { CategoriesComponent } from './pages/main-page/categories/categories.component';
import { UsersComponent } from './pages/main-page/users/users.component';
import { HomeComponent } from './pages/main-page/home/home.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'users', component: UsersComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'subcategories', component: SubcategoriesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
