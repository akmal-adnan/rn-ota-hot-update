import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ShieldCheck} from 'lucide-react-native';

import {formatCurrency} from '../../utils/formatters';
import {theme} from '../../theme';
import {AppText, Card, TrustBadge} from '../atoms';

type BalanceCardProps = {
  title: string;
  balance: number;
  availableBalance: number;
  currency: string;
};

export const BalanceCard = ({
  title,
  balance,
  availableBalance,
  currency,
}: BalanceCardProps) => {
  return (
    <Card style={styles.card} elevated>
      <View style={styles.topRow}>
        <AppText tone="secondary" variant="caption">
          {title}
        </AppText>
        <ShieldCheck size={16} color={theme.colors.semantic.success} />
      </View>
      <AppText variant="title" style={styles.balance}>
        {formatCurrency(balance, currency)}
      </AppText>
      <View style={styles.row}>
        <View style={styles.availRow}>
          <AppText tone="muted" variant="caption">
            Available
          </AppText>
          <AppText tone="secondary">
            {formatCurrency(availableBalance, currency)}
          </AppText>
        </View>
        <TrustBadge variant="verified" label="Verified" />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: theme.colors.border.focus,
    borderWidth: 1,
    backgroundColor: theme.colors.background.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  availRow: {
    gap: 2,
  },
});
