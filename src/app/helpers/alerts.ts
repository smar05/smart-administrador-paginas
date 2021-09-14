import Swal, { SweetAlertIcon } from 'sweetalert2';

export class alerts {
  //Funcion de alertas basicas
  static basicAlert(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire(title, text, icon);
  }
}
