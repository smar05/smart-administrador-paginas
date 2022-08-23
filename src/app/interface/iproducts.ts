export interface Iproducts {
  id?: string;
  category: string;
  date_created: Date;
  delivery_time: number;
  description: string;
  details: string;
  feedback: string;
  horizontal_slider: string;
  name: string;
  offer: string;
  price: string;
  reviews: any;
  sales: number;
  shipping: string;
  specification: string;
  stock: number;
  store: string;
  sub_category: string;
  summary: string;
  tags: string;
  title_list: string;
  top_banner: string;
  url: string;
  vertical_slider: string;
  video: string;
  views: number;
}

export enum EnumProductImg {
  main = 'main',
  top_banner = 'top_banner',
  default_banner = 'default_banner',
  horizontal_slider = 'horizontal_slider',
  vertical_slider = 'vertical_slider',
}
