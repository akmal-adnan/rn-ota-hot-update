import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import OtaHotUpdate from 'react-native-ota-hot-update';

import {theme} from '../../theme';
import {
  CheckUpdateBackendStatus,
  useCheckUpdateBackend,
} from '../../hooks/useCheckUpdateBackend';
import {AppText, Button, Card} from '../atoms';

type BackendUpdatePanelProps = {
  status: CheckUpdateBackendStatus;
  checkedAt: Date | null;
  currentVersion: number | null;
  message: string;
  isConfigured: boolean;
  downloadProgress: number;
  isClearingBundles: boolean;
  onCheck: ReturnType<typeof useCheckUpdateBackend>['checkForUpdates'];
  onInstall: ReturnType<typeof useCheckUpdateBackend>['applyUpdate'];
  onClearAllBundles: ReturnType<
    typeof useCheckUpdateBackend
  >['clearAllBundles'];
};

const formatCheckedAt = (date: Date | null) => {
  if (!date) {
    return 'Not checked yet';
  }

  return date.toLocaleString();
};

export const BackendUpdatePanel = ({
  status,
  checkedAt,
  currentVersion,
  message,
  isConfigured,
  downloadProgress,
  isClearingBundles,
  onCheck,
  onInstall,
  onClearAllBundles,
}: BackendUpdatePanelProps) => {
  return (
    <Card style={styles.card} elevated>
      <View style={styles.metaWrap}>
        <AppText variant="caption" tone="muted">
          Current bundle version
        </AppText>
        <AppText variant="subtitle">{currentVersion ?? 'Unknown'}</AppText>
      </View>

      <View style={styles.metaWrap}>
        <AppText variant="caption" tone="muted">
          Last checked
        </AppText>
        <AppText>{formatCheckedAt(checkedAt)}</AppText>
      </View>

      <View style={styles.messageWrap}>
        <AppText
          tone={status === 'error' ? 'secondary' : 'primary'}
          style={styles.messageText}>
          {message}
        </AppText>
      </View>

      {status === 'checking' ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={theme.colors.base.yellow} />
        </View>
      ) : null}

      {status === 'downloading' ? (
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, {width: `${downloadProgress}%`}]}
            />
          </View>
          <AppText variant="caption" tone="muted">
            {downloadProgress}%
          </AppText>
        </View>
      ) : null}

      {!isConfigured ? (
        <View style={styles.noticeWrap}>
          <AppText variant="caption" tone="muted">
            Configure serverBaseUrl and otaKey in useCheckUpdateBackend.ts to
            enable backend checks.
          </AppText>
        </View>
      ) : null}

      <View style={styles.buttonWrap}>
        {status === 'updateAvailable' ? (
          <Button onPress={onInstall} fullWidth>
            Install Backend Update
          </Button>
        ) : null}
        {status === 'downloading' ? (
          <Button fullWidth>Downloading...</Button>
        ) : null}
        {status === 'installed' ? (
          <Button onPress={() => OtaHotUpdate.resetApp()} fullWidth>
            Restart App
          </Button>
        ) : null}
        {status !== 'downloading' ? (
          <Button
            onPress={onCheck}
            fullWidth
            variant={status === 'updateAvailable' ? 'ghost' : 'primary'}>
            {status === 'checking' ? 'Checking...' : 'Check Again'}
          </Button>
        ) : null}
        {status !== 'downloading' ? (
          <Button
            onPress={isClearingBundles ? undefined : onClearAllBundles}
            fullWidth
            variant="ghost">
            {isClearingBundles ? 'Clearing Bundles...' : 'Clear All Bundles'}
          </Button>
        ) : null}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.lg,
  },
  metaWrap: {
    gap: theme.spacing.xs,
  },
  messageWrap: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  messageText: {
    lineHeight: 20,
  },
  loaderWrap: {
    alignItems: 'center',
  },
  noticeWrap: {
    marginTop: -theme.spacing.sm,
  },
  buttonWrap: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  progressWrap: {
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: theme.colors.border.default,
    borderRadius: theme.radii.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.base.yellow,
    borderRadius: theme.radii.sm,
  },
});
