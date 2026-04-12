import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Transaction} from '../../types';
import {formatCurrency, formatShortDate} from '../../utils/formatters';
import {getCategoryIcon} from '../../utils/iconMap';
import {theme} from '../../theme';
import {AppText, Card, IconCircle, StatusDot} from '../atoms';

type TransactionItemProps = {
  transaction: Transaction;
};

export const TransactionItem = ({transaction}: TransactionItemProps) => {
  const amountPrefix = transaction.type === 'credit' ? '+' : '-';
  const amountTone = transaction.type === 'credit' ? 'success' : 'primary';
  const {Icon, color, bg} = getCategoryIcon(transaction.category);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <IconCircle color={color} bg={bg}>
          <Icon />
        </IconCircle>
        <View style={styles.textBlock}>
          <AppText>{transaction.title}</AppText>
          <View style={styles.metaRow}>
            <AppText variant="caption" tone="muted">
              {transaction.category} • {formatShortDate(transaction.timestamp)}
            </AppText>
            <StatusDot status={transaction.status} />
          </View>
        </View>
        <AppText tone={amountTone} style={styles.amount}>
          {amountPrefix}
          {formatCurrency(transaction.amount)}
        </AppText>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  amount: {
    fontWeight: '600',
  },
});
