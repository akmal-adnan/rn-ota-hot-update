import React, {ReactNode} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {theme} from '../../theme';

type IconCircleProps = {
  children: ReactNode;
  color?: string;
  bg?: string;
  size?: number;
  style?: ViewStyle;
};

export const IconCircle = ({
  children,
  color,
  bg = theme.colors.background.subtle,
  size = 38,
  style,
}: IconCircleProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        style,
      ]}>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            color: color ?? theme.colors.text.muted,
            size: size * 0.48,
          })
        : children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
