import React from 'react';
import {StyleSheet, View} from 'react-native';

import {theme} from '../../theme';
import {AppText} from './AppText';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export const SectionTitle = ({title, subtitle}: SectionTitleProps) => {
  return (
    <View style={styles.container}>
      <AppText variant="subtitle">{title}</AppText>
      {subtitle ? (
        <AppText tone="secondary" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
});
