import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcategoriesComponent } from './subcategories.component';
import { SubcategoriesRoutingModule } from './subcategories-routing.module';

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveFormsModule } from '@angular/forms';
import { NewSubcategoriesComponent } from './new-subcategories/new-subcategories.component';
import { EditSubcategoriesComponent } from './edit-subcategories/edit-subcategories.component';

@NgModule({
  declarations: [
    SubcategoriesComponent,
    NewSubcategoriesComponent,
    EditSubcategoriesComponent,
  ],
  imports: [
    CommonModule,
    SubcategoriesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class SubcategoriesModule {}
