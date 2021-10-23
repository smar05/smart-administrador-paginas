import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { JsonToStringPipe } from '../../../pipes/json-to-string.pipe';

@NgModule({
  declarations: [UsersComponent, JsonToStringPipe],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  exports: [JsonToStringPipe],
})
export class UsersModule {}
