import React from 'react';
import {StyleSheet, View} from 'react-native';

import {theme} from '../../theme';
import {AppText} from './AppText';

type AvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 32,
  md: 44,
  lg: 56,
};

const fontMap = {
  sm: 'caption' as const,
  md: 'body' as const,
  lg: 'subtitle' as const,
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar = ({name, size = 'md'}: AvatarProps) => {
  const dim = sizeMap[size];

  return (
    <View
      style={[styles.circle, {width: dim, height: dim, borderRadius: dim / 2}]}>
      <AppText variant={fontMap[size]} tone="inverse" style={styles.text}>
        {getInitials(name)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: theme.colors.base.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.5,
  },
});
