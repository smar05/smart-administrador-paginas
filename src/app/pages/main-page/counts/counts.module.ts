import { NewCountsComponent } from './new-counts/new-counts.component';
import { CountsComponent } from './counts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from '../../../pipes/pipes/pipes.module';
import { CountsRoutingModule } from './counts-routing.module';
import { EditCountsComponent } from './edit-counts/edit-counts.component';

@NgModule({
  declarations: [CountsComponent, NewCountsComponent, EditCountsComponent],
  imports: [
    CommonModule,
    CountsRoutingModule,
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
export class CountsModule {}
