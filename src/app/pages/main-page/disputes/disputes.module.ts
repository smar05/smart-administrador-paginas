import { SharedModule } from './../../../shared/shared.module';
import { PipesModule } from './../../../pipes/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisputesComponent } from './disputes.component';
import { DisputesRoutingModule } from './disputes-routing.module';
import { EditDisputesComponent } from './edit-disputes/edit-disputes.component';

@NgModule({
  declarations: [DisputesComponent, EditDisputesComponent],
  imports: [
    CommonModule,
    DisputesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    PipesModule,
    SharedModule,
  ],
})
export class DisputesModule {}
