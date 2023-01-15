import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substr',
})
export class SubstrPipe implements PipeTransform {
  transform(value: string, ...args: any): any {
    let substr: string = value.substring(0, 15) + '...';

    return substr;
  }
}
