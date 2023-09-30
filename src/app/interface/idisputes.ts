export interface Idisputes {
  id?: string;
  answer?: string;
  date_answer?: Date;
  date_dispute?: Date;
  message?: string;
  order?: string;
  receiver?: string;
  transmitter?: string;
  status?: string;
  idShop: string;
}

export enum EnumDisputesStatus {
  answered = 'answered',
  not_answered = 'not_answered',
}
