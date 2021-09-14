import Swal, { SweetAlertIcon } from 'sweetalert2';

export class alerts {
  static basicAlert(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire(title, text, icon);
  }
}
