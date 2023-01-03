import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'urlSecure',
})
export class UrlSecurePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(value: any, ...args: any[]): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
