import {
  Account,
  Profile,
  QuickAction,
  SecuritySetting,
  Transaction,
} from '../types';

export const primaryAccount: Account = {
  id: 'acc-primary',
  name: 'Main Vault',
  accountNumber: '**** 1042',
  currency: 'USD',
  balance: 12840.76,
  availableBalance: 12310.22,
};

export const recentTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Quantum Grocer',
    category: 'Groceries',
    type: 'debit',
    amount: 86.4,
    timestamp: '2026-04-05T12:30:00.000Z',
    status: 'cleared',
  },
  {
    id: 'tx-2',
    title: 'Freelance Payment',
    category: 'Income',
    type: 'credit',
    amount: 1800,
    timestamp: '2026-04-04T09:10:00.000Z',
    status: 'cleared',
  },
  {
    id: 'tx-3',
    title: 'Metro Ride',
    category: 'Transport',
    type: 'debit',
    amount: 12,
    timestamp: '2026-04-03T17:45:00.000Z',
    status: 'pending',
  },
  {
    id: 'tx-4',
    title: 'Cloud Drive Pro',
    category: 'Subscription',
    type: 'debit',
    amount: 9.99,
    timestamp: '2026-04-03T08:20:00.000Z',
    status: 'cleared',
  },
];

export const quickActions: QuickAction[] = [
  {id: 'qa-1', label: 'Transfer', hint: 'Move funds fast'},
  {id: 'qa-2', label: 'Pay Bills', hint: 'Utilities and cards'},
  {id: 'qa-3', label: 'Insights', hint: 'Spending analytics'},
];

export const userProfile: Profile = {
  fullName: 'Akmal Idris',
  email: 'akmal@example.com',
  memberSince: '2021-11-12',
  riskLevel: 'Low',
};

export const securitySettings: SecuritySetting[] = [
  {
    id: 'sec-1',
    title: 'Biometric Login',
    description: 'Unlock using Face ID / fingerprint',
    enabled: true,
  },
  {
    id: 'sec-2',
    title: 'Transaction Verification',
    description: 'Require passcode for outgoing transfer',
    enabled: true,
  },
  {
    id: 'sec-3',
    title: 'Suspicious Activity Alerts',
    description: 'Instant push alerts for unusual events',
    enabled: true,
  },
];
