import { EditProductComponent } from './edit-product/edit-product.component';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductsComponent } from './products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'new-product',
    component: NewProductComponent,
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
