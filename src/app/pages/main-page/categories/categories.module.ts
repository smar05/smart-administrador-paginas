import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';

import { ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '../../../pipes/pipes/pipes.module';
import { NewCategoriesComponent } from './new-categories/new-categories.component';

@NgModule({
  declarations: [CategoriesComponent, NewCategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    PipesModule,
    ReactiveFormsModule,
  ],
})
export class CategoriesModule {}
