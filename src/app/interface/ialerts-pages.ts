import { SweetAlertIcon } from 'sweetalert2';
export interface IAlertsPages {
  active: boolean;
  icon: SweetAlertIcon;
  text: string;
  title: string;
  idApplication: string;
  page: string;
}

export enum EnumAlertsPagesIdApplication {
  ADMIN = 'admin',
  E_SHOP = 'e_shop',
}
