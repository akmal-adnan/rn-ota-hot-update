import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ROUTES} from '../constants/routes';
import {useAccountDetails} from '../hooks';
import {theme} from '../theme';
import {HomeStackParamList} from '../navigations';
import {
  AppText,
  BalanceCard,
  Button,
  Divider,
  Screen,
  SectionTitle,
  TrustBadge,
  TransactionItem,
} from '../components';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  typeof ROUTES.ACCOUNT_DETAILS
>;

const ListSeparator = () => <View style={styles.separator} />;

export const AccountDetails = ({route}: Props) => {
  const {details, isLoading, error, reload} = useAccountDetails(
    route.params?.accountId,
  );

  return (
    <Screen>
      <View style={styles.headerWrap}>
        <View style={styles.titleRow}>
          <SectionTitle
            title="Account Details"
            subtitle="Balances and movements with secure traceability"
          />
          <TrustBadge variant="encrypted" />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.base.yellow} />
        </View>
      ) : null}

      {error ? (
        <View style={styles.centered}>
          <AppText tone="secondary">{error}</AppText>
          <View style={styles.retryWrap}>
            <Button onPress={reload}>Retry</Button>
          </View>
        </View>
      ) : null}

      {details ? (
        <FlatList
          data={details.transactions}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <BalanceCard
                title={`${details.account.name} ${details.account.accountNumber}`}
                balance={details.account.balance}
                availableBalance={details.account.availableBalance}
                currency={details.account.currency}
              />
              <Divider style={styles.divider} />
              <SectionTitle
                title="Transactions"
                subtitle="Latest verified movements"
              />
            </View>
          }
          renderItem={({item}) => <TransactionItem transaction={item} />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListSeparator}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    marginTop: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  retryWrap: {
    marginTop: theme.spacing.md,
    width: 130,
  },
  listHeader: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  divider: {
    marginVertical: theme.spacing.xs,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  separator: {
    height: theme.spacing.sm,
  },
});
