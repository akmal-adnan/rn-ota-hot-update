import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import {BackendUpdatePanel, Screen, SectionTitle} from '../components';
import {useCheckUpdateBackend} from '../hooks';
import {theme} from '../theme';

export const CheckUpdateBackend = () => {
  const {
    status,
    checkedAt,
    currentVersion,
    message,
    isConfigured,
    downloadProgress,
    isClearingBundles,
    checkForUpdates,
    applyUpdate,
    clearAllBundles,
  } = useCheckUpdateBackend();

  useFocusEffect(
    useCallback(() => {
      checkForUpdates();
    }, [checkForUpdates]),
  );

  return (
    <Screen noHeader>
      <View style={styles.headerWrap}>
        <SectionTitle
          title="Backend OTA"
          subtitle="Manifest-based update check from your server"
        />
      </View>

      <BackendUpdatePanel
        status={status}
        checkedAt={checkedAt}
        currentVersion={currentVersion}
        message={message}
        isConfigured={isConfigured}
        downloadProgress={downloadProgress}
        isClearingBundles={isClearingBundles}
        onCheck={checkForUpdates}
        onInstall={applyUpdate}
        onClearAllBundles={clearAllBundles}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    marginTop: theme.spacing.md,
  },
});
