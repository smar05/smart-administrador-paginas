import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '../../../pipes/pipes/pipes.module';
import { NewCategoriesComponent } from './new-categories/new-categories.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';

@NgModule({
  declarations: [
    CategoriesComponent,
    NewCategoriesComponent,
    EditCategoriesComponent,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class CategoriesModule {}
