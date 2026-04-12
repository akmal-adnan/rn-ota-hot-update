import React, {PropsWithChildren} from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

import {theme} from '../../theme';

type Variant = 'title' | 'subtitle' | 'body' | 'caption';

type AppTextProps = TextProps &
  PropsWithChildren<{
    variant?: Variant;
    tone?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'success';
  }>;

const variantStyles = StyleSheet.create({
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
  },
  body: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.regular,
  },
  caption: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.medium,
  },
});

const toneStyles = StyleSheet.create({
  primary: {color: theme.colors.text.primary},
  secondary: {color: theme.colors.text.secondary},
  muted: {color: theme.colors.text.muted},
  inverse: {color: theme.colors.text.inverse},
  success: {color: theme.colors.text.success},
});

export const AppText = ({
  children,
  variant = 'body',
  tone = 'primary',
  style,
  ...rest
}: AppTextProps) => {
  return (
    <Text
      style={[styles.base, variantStyles[variant], toneStyles[tone], style]}
      {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.family.regular,
  },
});
