export interface Iusers {
  id: string;
  address: string;
  city: number;
  country: string;
  state: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  idType: string; // Tipo de identificacion
  idValue: string;
  idShop: string;
}

export enum EnumUsersIdType {
  C_C = 'C.C', // C.C (Cédula de Ciudadania)
  C_E = 'C.E', // C.E (Cédula Extranjería)
  P_A = 'P.A', // P.A (Pasaporte)
  NIT = 'NIT', // NIT (Número de Identificación Tributaria)
}
