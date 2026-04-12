import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Lock, ShieldCheck} from 'lucide-react-native';

import {theme} from '../../theme';
import {AppText} from './AppText';

type TrustBadgeProps = {
  label?: string;
  variant?: 'encrypted' | 'verified';
};

export const TrustBadge = ({label, variant = 'encrypted'}: TrustBadgeProps) => {
  const Icon = variant === 'encrypted' ? Lock : ShieldCheck;
  const text = label ?? (variant === 'encrypted' ? 'Encrypted' : 'Verified');

  return (
    <View style={styles.badge}>
      <Icon size={11} color={theme.colors.semantic.success} />
      <AppText style={styles.text}>{text}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.semantic.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
  },
  text: {
    fontSize: 11,
    color: theme.colors.semantic.success,
    fontWeight: '500',
  },
});
