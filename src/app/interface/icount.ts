export interface ICount {
  id: string;
  name: string;
  email: string;
  celphone: string;
  sex: string;
  active: boolean;
  country: string;
  state: string;
  city: string;
  permission: string;
  idType: string; // Tipo de identificacion
  idValue: string;
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
