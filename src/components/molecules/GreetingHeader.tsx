import React from 'react';
import {StyleSheet, View} from 'react-native';

import {theme} from '../../theme';
import {AppText, Avatar, TrustBadge} from '../atoms';

type GreetingHeaderProps = {
  name: string;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) {
    return 'Good morning';
  }
  if (h < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

export const GreetingHeader = ({name}: GreetingHeaderProps) => {
  const firstName = name.split(' ')[0];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar name={name} size="lg" />
        <View style={styles.textBlock}>
          <AppText tone="muted" variant="caption">
            {getGreeting()}
          </AppText>
          <AppText variant="subtitle">{firstName}</AppText>
        </View>
      </View>
      <TrustBadge variant="encrypted" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  textBlock: {
    gap: 2,
  },
});
