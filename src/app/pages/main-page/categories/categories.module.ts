import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
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
