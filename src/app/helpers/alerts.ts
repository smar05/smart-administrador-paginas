import Swal, { SweetAlertIcon } from 'sweetalert2';

export class alerts {
  //Funcion de alertas basicas
  static basicAlert(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire(title, text, icon);
  }

  //Funcion para alerta de confirmacion
  static confirmAlert(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string
  ): any {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    });
  }
}
