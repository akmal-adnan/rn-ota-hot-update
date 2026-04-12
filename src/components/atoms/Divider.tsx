import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {theme} from '../../theme';

type DividerProps = {
  style?: ViewStyle;
};

export const Divider = ({style}: DividerProps) => {
  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.subtle,
  },
});
