import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisputesComponent } from './disputes.component';
import { DisputesRoutingModule } from './disputes-routing.module';

@NgModule({
  declarations: [DisputesComponent],
  imports: [CommonModule, DisputesRoutingModule],
})
export class DisputesModule {}
