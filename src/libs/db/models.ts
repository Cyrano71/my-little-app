export interface UserDoc {
  _id?: string;
  userName: string;
  address: string;
  transactions?: string[];
}

export interface TransactionDoc {
  id: string;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  txHash: string;
  amount: number;
}
