import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SecuritySetting} from '../../types';
import {securityIcons} from '../../utils/iconMap';
import {theme} from '../../theme';
import {AppText, Card, IconCircle, Toggle} from '../atoms';

type ProfileSecurityItemProps = {
  item: SecuritySetting;
  onToggle: (id: string) => void;
};

export const ProfileSecurityItem = ({
  item,
  onToggle,
}: ProfileSecurityItemProps) => {
  const Icon = securityIcons[item.id];

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <IconCircle
          color={
            item.enabled
              ? theme.colors.semantic.success
              : theme.colors.text.muted
          }
          bg={
            item.enabled
              ? theme.colors.semantic.successSoft
              : theme.colors.background.subtle
          }
          size={36}>
          {Icon ? <Icon /> : null}
        </IconCircle>
        <View style={styles.textWrap}>
          <AppText>{item.title}</AppText>
          <AppText tone="muted" variant="caption" style={styles.description}>
            {item.description}
          </AppText>
        </View>
        <Toggle enabled={item.enabled} onToggle={() => onToggle(item.id)} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  description: {
    marginTop: theme.spacing.xs,
  },
});
