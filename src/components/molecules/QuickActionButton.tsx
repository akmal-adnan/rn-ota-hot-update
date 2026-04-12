import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {QuickAction} from '../../types';
import {quickActionIcons} from '../../utils/iconMap';
import {theme} from '../../theme';
import {AppText, IconCircle} from '../atoms';

type QuickActionButtonProps = {
  action: QuickAction;
  onPress: (action: QuickAction) => void;
};

export const QuickActionButton = ({
  action,
  onPress,
}: QuickActionButtonProps) => {
  const Icon = quickActionIcons[action.label];

  return (
    <Pressable
      style={({pressed}) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(action)}>
      <View style={styles.card}>
        <IconCircle
          bg={theme.colors.base.yellowGlow}
          color={theme.colors.base.yellow}
          size={42}>
          {Icon ? <Icon /> : null}
        </IconCircle>
        <AppText variant="caption" style={styles.label}>
          {action.label}
        </AppText>
        <AppText tone="muted" style={styles.hint}>
          {action.hint}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 11,
    textAlign: 'center',
  },
});
