import { alerts } from './alerts';
import { FormGroup } from '@angular/forms';

export class functions {
  //Validar campos del formulario
  static invalidField(
    field: string,
    f: FormGroup,
    formSubmitted: boolean
  ): boolean {
    return formSubmitted && f.controls[field].invalid;
  }

  //Funcion para determinar el tamaño de la pantalla
  static screenSize(minWidth: number, maxWidth: number): boolean {
    if (
      window.matchMedia(`(min-width:${minWidth}px)and(max-width:${maxWidth}px)`)
        .matches
    ) {
      return true;
    }
    return false;
  }

  //Validar imagenes
  static validateImage(e: any): any {
    return new Promise((resolve) => {
      const image = e.target.files[0];
      //validar el formato
      if (image['type'] !== 'image/jpeg' && image['type'] !== 'image/png') {
        alerts.basicAlert(
          'Error',
          'La imagen debe estar en formato PNG o JPG',
          'error'
        );
        return;
      }
      //validacion de tamaño
      else if (image['size'] > 2000000) {
        alerts.basicAlert(
          'Error',
          'La imagen no debe superar 2MB de peso',
          'error'
        );
        return;
      }
      //Mostrar imagen temporal
      else {
        let data = new FileReader();
        data.readAsDataURL(image);
        data.onloadend = () => {
          resolve(data.result);
        };
      }
    });
  }

  //Crear url
  static createUrl(value: string): string {
    value = value.toLowerCase();
    value = value.replace(/[ ]/g, '-');
    value = value.replace(/[á]/g, 'a');
    value = value.replace(/[é]/g, 'e');
    value = value.replace(/[í]/g, 'i');
    value = value.replace(/[ó]/g, 'o');
    value = value.replace(/[ú]/g, 'u');
    value = value.replace(/[Á]/g, 'A');
    value = value.replace(/[É]/g, 'E');
    value = value.replace(/[Í]/g, 'I');
    value = value.replace(/[Ó]/g, 'O');
    value = value.replace(/[Ú]/g, 'U');
    value = value.replace(/[ñ]/g, 'n');
    value = value.replace(/[,]/g, '');
    return value;
  }
}
