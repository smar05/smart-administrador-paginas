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
  permission?: any;
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

export enum EnumCountPermission {
  users_read = 'users_read',
  users_write = 'users_write',
  categories_read = 'categories_read',
  categories_write = 'categories_write',
  subcategories_read = 'subcategories_read',
  subcategories_write = 'subcategories_write',
  store_read = 'store_read',
  store_write = 'store_write',
  products_read = 'products_read',
  products_write = 'products_write',
  orders_read = 'orders_read',
  orders_write = 'orders_write',
  sales_read = 'sales_read',
  sales_write = 'sales_write',
  disputes_read = 'disputes_read',
  disputes_write = 'disputes_write',
  messages_read = 'messages_read',
  messages_write = 'messages_write',
  counts_read = 'counts_read',
  counts_write = 'counts_write',
}
