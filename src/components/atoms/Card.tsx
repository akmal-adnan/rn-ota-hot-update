import React, {PropsWithChildren} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {theme} from '../../theme';

type CardProps = PropsWithChildren<{
  style?: ViewStyle;
  elevated?: boolean;
}>;

export const Card = ({children, style, elevated = false}: CardProps) => {
  return (
    <View style={[styles.card, elevated && theme.shadows.sm, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: theme.spacing.lg,
  },
});
