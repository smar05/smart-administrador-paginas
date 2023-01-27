import { ICountPermissions } from './icount-permissions';

export interface ICount {
  id?: string;
  name?: string;
  email?: string;
  celphone?: string;
  sex?: string;
  active?: boolean;
  country?: string;
  state?: string;
  city?: number;
  permission?: string | ICountPermissions;
  idType?: string; // Tipo de identificacion
  idValue?: string;
  activeCount?: boolean; // Para que el usuario admin habilite o desahibilite otras cuentas
  keyCount?: string; // Llave para asociar todas las cuentas que pertenecen a un mismo grupo
}

export enum EnumCountPermission {
  admin = 'admin',
}

export enum EnumCountIdType {
  C_C = 'C.C', // C.C (Cédula de Ciudadania)
  C_E = 'C.E', // C.E (Cédula Extranjería)
  P_A = 'P.A', // P.A (Pasaporte)
  NIT = 'NIT', // NIT (Número de Identificación Tributaria)
}
