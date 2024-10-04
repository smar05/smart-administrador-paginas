import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';

@NgModule({
  declarations: [StoresComponent],
  imports: [
    CommonModule,
    StoresRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class StoresModule {}
