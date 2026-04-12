export type Account = {
  id: string;
  name: string;
  accountNumber: string;
  currency: 'USD';
  balance: number;
  availableBalance: number;
};

export type TransactionType = 'credit' | 'debit';

export type TransactionStatus = 'cleared' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  title: string;
  category: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
};

export type Profile = {
  fullName: string;
  email: string;
  memberSince: string;
  riskLevel: 'Low' | 'Medium' | 'High';
};

export type SecuritySetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type QuickAction = {
  id: string;
  label: string;
  hint: string;
};
