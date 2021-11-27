import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateObjects',
})
export class SeparateObjectsPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let key = Object.keys(value).toString();
    return key;
  }
}
