import { SharedModule } from './../../../shared/shared.module';
import { PipesModule } from './../../../pipes/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { EditMessagesComponent } from './edit-messages/edit-messages.component';

@NgModule({
  declarations: [MessagesComponent, EditMessagesComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule,
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
export class MessagesModule {}
