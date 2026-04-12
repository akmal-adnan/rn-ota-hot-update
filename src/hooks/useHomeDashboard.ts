import {useMemo} from 'react';

import {
  primaryAccount,
  quickActions,
  recentTransactions,
} from '../data/mockBanking';
import {useAsyncResource} from './useAsyncResource';

type HomeDashboardData = {
  accountId: string;
  accountName: string;
  balance: number;
  currency: string;
  availableBalance: number;
  quickActions: typeof quickActions;
  latestTransactions: typeof recentTransactions;
};

const fetchHomeDashboard = async (): Promise<HomeDashboardData> => {
  await new Promise(resolve => setTimeout(resolve, 220));

  return {
    accountId: primaryAccount.id,
    accountName: primaryAccount.name,
    balance: primaryAccount.balance,
    currency: primaryAccount.currency,
    availableBalance: primaryAccount.availableBalance,
    quickActions,
    latestTransactions: recentTransactions.slice(0, 3),
  };
};

export const useHomeDashboard = () => {
  const asyncState = useAsyncResource(fetchHomeDashboard);

  return useMemo(
    () => ({
      ...asyncState,
      dashboard: asyncState.data,
    }),
    [asyncState],
  );
};
