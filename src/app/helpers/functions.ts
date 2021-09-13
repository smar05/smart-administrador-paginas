import { FormGroup } from '@angular/forms';

export class functions {
  static invalidField(
    field: string,
    f: FormGroup,
    formSubmitted: boolean
  ): boolean {
    if (formSubmitted && f.controls[field].invalid) {
      return true;
    } else {
      return false;
    }
  }
}
