import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {theme} from '../../theme';
import {AppText} from './AppText';

type StatusDotProps = {
  status: 'cleared' | 'pending' | 'failed';
  showLabel?: boolean;
  style?: ViewStyle;
};

const statusConfig = {
  cleared: {color: theme.colors.semantic.success, label: 'Cleared'},
  pending: {color: theme.colors.semantic.warning, label: 'Pending'},
  failed: {color: theme.colors.semantic.danger, label: 'Failed'},
};

export const StatusDot = ({
  status,
  showLabel = false,
  style,
}: StatusDotProps) => {
  const config = statusConfig[status];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.dot, {backgroundColor: config.color}]} />
      {showLabel ? (
        <AppText style={[styles.label, {color: config.color}]}>
          {config.label}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
