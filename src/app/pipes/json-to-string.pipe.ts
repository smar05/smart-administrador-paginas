import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToString',
})
export class JsonToStringPipe implements PipeTransform {
  transform(value: any, ...args: any): any {
    if (value) {
      let arr = JSON.parse(value);
      let str = '';
      for (let i = 0; i < arr.length; i++) {
        str += i + 1 === arr.length ? arr[i] : arr[i] + ', ';
      }
      return str;
    }
  }
}
