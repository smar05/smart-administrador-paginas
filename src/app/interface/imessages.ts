export interface Imessages {
  id?: string;
  answer?: string;
  date_answer?: Date | string;
  date_message?: Date | string;
  message?: string;
  url_product?: string;
  receiver?: string;
  transmitter?: string;
  status?: string;
  idShop: string;
}

export enum EnumMessagesStatus {
  answered = 'answered',
  not_answered = 'not_answered',
}
