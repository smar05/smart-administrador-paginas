import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { JsonToStringPipe } from '../../../pipes/json-to-string.pipe';

@NgModule({
  declarations: [UsersComponent, JsonToStringPipe],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [JsonToStringPipe],
})
export class UsersModule {}
