import React, {PropsWithChildren} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {theme} from '../../theme';

type ScreenProps = PropsWithChildren<{
  padded?: boolean;
  noHeader?: boolean;
}>;

export const Screen = ({
  children,
  padded = true,
  noHeader = false,
}: ScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, noHeader && {paddingTop: insets.top}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.base.black}
      />
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
  },
});
