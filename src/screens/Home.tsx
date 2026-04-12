import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ROUTES} from '../constants/routes';
import {useHomeDashboard} from '../hooks';
import {HomeStackParamList} from '../navigations';
import {theme} from '../theme';
import {
  AppText,
  BalanceCard,
  Button,
  Divider,
  GreetingHeader,
  QuickActionButton,
  Screen,
  SectionTitle,
  TransactionItem,
} from '../components';

type Props = NativeStackScreenProps<HomeStackParamList, typeof ROUTES.HOME>;

const ListSeparator = () => <View style={styles.separator} />;

export const Home = ({navigation}: Props) => {
  const {dashboard, isLoading, error, reload} = useHomeDashboard();

  const goToAccountDetails = () => {
    if (!dashboard?.accountId) {
      return;
    }

    navigation.navigate(ROUTES.ACCOUNT_DETAILS, {
      accountId: dashboard.accountId,
    });
  };

  return (
    <Screen noHeader>
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

      {dashboard ? (
        <FlatList
          data={dashboard.latestTransactions}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <GreetingHeader name="Akmal Idris" />

              <BalanceCard
                title={`${dashboard.accountName} • ${dashboard.accountId}`}
                balance={dashboard.balance}
                availableBalance={dashboard.availableBalance}
                currency={dashboard.currency}
              />

              <Divider style={styles.divider} />

              <SectionTitle
                title="Quick Actions"
                subtitle="Trusted shortcuts"
              />
              <View style={styles.actionRow}>
                {dashboard.quickActions.map(item => (
                  <QuickActionButton
                    key={item.id}
                    action={item}
                    onPress={goToAccountDetails}
                  />
                ))}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.sectionHeaderRow}>
                <SectionTitle
                  title="Recent Activity"
                  subtitle="Last verified transactions"
                />
                <View style={styles.ctaWrap}>
                  <Button variant="ghost" onPress={goToAccountDetails}>
                    View Account
                  </Button>
                </View>
              </View>
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
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sectionHeaderRow: {
    gap: theme.spacing.md,
  },
  ctaWrap: {
    width: 160,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  separator: {
    height: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
});
