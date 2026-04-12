import {useCallback, useMemo} from 'react';

import {primaryAccount, recentTransactions} from '../data/mockBanking';
import {useAsyncResource} from './useAsyncResource';

type AccountDetailsData = {
  account: typeof primaryAccount;
  transactions: typeof recentTransactions;
};

const fetchAccountDetails = async (
  accountId?: string,
): Promise<AccountDetailsData> => {
  await new Promise(resolve => setTimeout(resolve, 260));

  return {
    account: {
      ...primaryAccount,
      id: accountId ?? primaryAccount.id,
    },
    transactions: recentTransactions,
  };
};

export const useAccountDetails = (accountId?: string) => {
  const runner = useCallback(() => fetchAccountDetails(accountId), [accountId]);
  const asyncState = useAsyncResource(runner);

  return useMemo(
    () => ({
      ...asyncState,
      details: asyncState.data,
    }),
    [asyncState],
  );
};
