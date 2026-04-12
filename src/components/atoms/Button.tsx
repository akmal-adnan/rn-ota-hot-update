import React, {PropsWithChildren} from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';

import {theme} from '../../theme';
import {AppText} from './AppText';

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
  style?: ViewStyle;
}>;

export const Button = ({
  children,
  onPress,
  variant = 'primary',
  fullWidth = false,
  style,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.ghost,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}>
      <AppText
        variant="caption"
        tone={variant === 'primary' ? 'inverse' : 'primary'}
        style={styles.label}>
        {children}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.base.yellow,
  },
  ghost: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.elevated,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    letterSpacing: 0.3,
  },
});
