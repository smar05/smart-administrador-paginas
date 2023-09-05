export interface Icategories {
  id?: string;
  //position?: number;
  icon?: string;
  name?: string;
  title_list?: string;
  url?: string;
  view?: number;
  state?: string;
  idShop?: string;
}

export enum EnumCategorieState {
  show = 'show',
  hidden = 'hidden',
}

export enum EnumCategorieImg {
  main = 'main',
}
