import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {theme} from '../../theme';

type ToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export const Toggle = ({enabled, onToggle}: ToggleProps) => {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.track, enabled && styles.trackOn]}
      accessibilityRole="switch"
      accessibilityState={{checked: enabled}}>
      <View style={[styles.thumb, enabled && styles.thumbOn]} />
    </Pressable>
  );
};

const TRACK_W = 44;
const TRACK_H = 26;
const THUMB = 20;
const OFFSET = 3;

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: theme.colors.background.subtle,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    justifyContent: 'center',
    paddingHorizontal: OFFSET,
  },
  trackOn: {
    backgroundColor: theme.colors.semantic.successSoft,
    borderColor: theme.colors.semantic.success,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: theme.colors.text.muted,
  },
  thumbOn: {
    backgroundColor: theme.colors.semantic.success,
    alignSelf: 'flex-end',
  },
});
