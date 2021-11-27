import { SeparateObjectsPipe } from '../separate-objects.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonToStringPipe } from '../json-to-string.pipe';

@NgModule({
  declarations: [JsonToStringPipe, SeparateObjectsPipe],
  imports: [CommonModule],
  exports: [JsonToStringPipe, SeparateObjectsPipe],
})
export class PipesModule {}
