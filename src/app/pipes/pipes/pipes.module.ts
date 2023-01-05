import { SubstrPipe } from './../substr.pipe';
import { UrlSecurePipe } from './../url-secure.pipe';
import { SeparateObjectsPipe } from '../separate-objects.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonToStringPipe } from '../json-to-string.pipe';

@NgModule({
  declarations: [
    JsonToStringPipe,
    SeparateObjectsPipe,
    UrlSecurePipe,
    SubstrPipe,
  ],
  imports: [CommonModule],
  exports: [JsonToStringPipe, SeparateObjectsPipe, UrlSecurePipe, SubstrPipe],
})
export class PipesModule {}
