import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresComponent } from './stores.component';
import { StoresRoutingModule } from './stores-routing.module';

@NgModule({
  declarations: [StoresComponent],
  imports: [CommonModule, StoresRoutingModule],
})
export class StoresModule {}
