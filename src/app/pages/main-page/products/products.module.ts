import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { PipesModule } from '../../../pipes/pipes/pipes.module';

import { ReactiveFormsModule } from '@angular/forms';
import { NewProductComponent } from './new-product/new-product.component';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [ProductsComponent, NewProductComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    PipesModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgxSummernoteModule,
  ],
})
export class ProductsModule {}
