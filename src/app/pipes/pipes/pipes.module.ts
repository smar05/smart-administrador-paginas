import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonToStringPipe } from '../json-to-string.pipe';

@NgModule({
  declarations: [JsonToStringPipe],
  imports: [CommonModule],
  exports: [JsonToStringPipe],
})
export class PipesModule {}
