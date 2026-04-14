import {useCallback, useMemo, useRef, useState} from 'react';
import {Alert, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import OtaHotUpdate from 'react-native-ota-hot-update';

const OTA_BACKEND_CONFIG = {
  // Backend host, e.g. https://api.example.com
  serverBaseUrl: 'http://localhost:3001',
  // Manifest-like endpoint returning version + platform URLs.
  manifestPath: '/api/updates/latest',
  // Prototype only. Move to env var for production.
  otaKey: '5a555bc3303689963bf9909ef63dc50f9310bdd3bab4a550bf570f14b4e93627',
  maxBundleVersions: 3,
};

type ResponseData = {
  version?: number;
  downloadAndroidUrl?: string;
  downloadIosUrl?: string;
  sha256Android?: string;
  sha256Ios?: string;
};

type PendingUpdate = {
  bundleUrl: string;
  version: number;
};

const base = OTA_BACKEND_CONFIG.serverBaseUrl;
const path = OTA_BACKEND_CONFIG.manifestPath;
const urlPath = base + path;

const pickBundleUrl = (manifest: ResponseData): string | undefined => {
  return Platform.OS === 'ios'
    ? manifest.downloadIosUrl
    : manifest.downloadAndroidUrl;
};

export type CheckUpdateBackendStatus =
  | 'idle'
  | 'checking'
  | 'upToDate'
  | 'updateAvailable'
  | 'downloading'
  | 'installing'
  | 'installed'
  | 'error';

export type CheckUpdateBackendResult = {
  status: CheckUpdateBackendStatus;
  checkedAt: Date | null;
  currentVersion: number | null;
  message: string;
  isConfigured: boolean;
  downloadProgress: number;
  isClearingBundles: boolean;
  checkForUpdates: () => Promise<void>;
  applyUpdate: () => Promise<void>;
  clearAllBundles: () => Promise<void>;
};

const defaultMessage =
  'Ready to verify whether a newer OTA bundle is available from backend.';

export const useCheckUpdateBackend = (): CheckUpdateBackendResult => {
  const [status, setStatus] = useState<CheckUpdateBackendStatus>('idle');
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [message, setMessage] = useState(defaultMessage);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isClearingBundles, setIsClearingBundles] = useState(false);
  const isCheckingRef = useRef(false);
  const pendingUpdateRef = useRef<PendingUpdate | null>(null);

  const isConfigured = Boolean(
    OTA_BACKEND_CONFIG.serverBaseUrl && OTA_BACKEND_CONFIG.otaKey,
  );

  const checkForUpdates = useCallback(async () => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;

    const now = new Date();
    setStatus('checking');
    setMessage('Checking backend update manifest...');

    let localVersion = 0;
    try {
      localVersion = await OtaHotUpdate.getCurrentVersion();
      setCurrentVersion(localVersion);
    } catch {
      setCurrentVersion(null);
    }

    if (!isConfigured) {
      setStatus('error');
      setCheckedAt(now);
      setMessage(
        'Backend update check is not configured yet. Add serverBaseUrl and otaKey in useCheckUpdateBackend.ts.',
      );
      isCheckingRef.current = false;
      return;
    }

    try {
      const response = await fetch(urlPath, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-ota-key': OTA_BACKEND_CONFIG.otaKey,
        },
      });

      if (response.status === 401) {
        throw new Error(
          'Unauthorized OTA key. Verify x-ota-key configuration.',
        );
      }

      if (!response.ok) {
        let backendError = '';

        try {
          const errorPayload = await response.json();
          backendError = errorPayload?.error || errorPayload?.message || '';
        } catch {
          backendError = '';
        }

        throw new Error(
          `Backend request failed (${response.status})${
            backendError ? `: ${backendError}` : '.'
          }`,
        );
      }

      const data = (await response.json()) as ResponseData;
      const remoteVersion = Number(data.version);
      const bundleUrl = pickBundleUrl(data);

      setCheckedAt(now);

      if (!Number.isFinite(remoteVersion)) {
        throw new Error('Malformed manifest response: version is missing.');
      }

      if (remoteVersion > localVersion) {
        if (!bundleUrl) {
          throw new Error(
            `Update ${remoteVersion} found, but no ${Platform.OS} bundle URL is available.`,
          );
        }

        pendingUpdateRef.current = {
          bundleUrl,
          version: remoteVersion,
        };
        setStatus('updateAvailable');
        setMessage(
          `Update detected. Bundle version ${remoteVersion} is available.`,
        );
        return;
      }

      pendingUpdateRef.current = null;
      setStatus('upToDate');
      setMessage('App is already up to date.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to check backend update manifest.';
      setStatus('error');
      setCheckedAt(now);
      setMessage(errorMessage);
    } finally {
      isCheckingRef.current = false;
    }
  }, [isConfigured]);

  const applyUpdate = useCallback(async () => {
    const pending = pendingUpdateRef.current;
    if (!pending) {
      setStatus('error');
      setMessage('No update available to install.');
      return;
    }

    const {bundleUrl, version} = pending;

    setStatus('downloading');
    setDownloadProgress(0);
    setMessage(`Downloading bundle version ${version}...`);

    try {
      OtaHotUpdate.downloadBundleUri(ReactNativeBlobUtil, bundleUrl, version, {
        progress(received, total) {
          const pct = +total > 0 ? Math.round((+received / +total) * 100) : 0;
          setDownloadProgress(pct);
          setMessage(`Downloading... ${pct}%`);
        },
        updateSuccess() {
          pendingUpdateRef.current = null;
          setCurrentVersion(version);
          setDownloadProgress(100);
          setStatus('installed');
          setMessage(
            `Bundle version ${version} installed successfully. Restart to apply.`,
          );
          Alert.alert(
            'Update Installed',
            'The app needs to restart to apply the update. Restart now?',
            [
              {text: 'Later', style: 'cancel'},
              {
                text: 'Restart',
                onPress: () => OtaHotUpdate.resetApp(),
              },
            ],
          );
        },
        updateFail(errorMsg) {
          setStatus('error');
          setDownloadProgress(0);
          setMessage(`Install failed: ${errorMsg || 'Unknown error'}`);
        },
        restartAfterInstall: false,
        maxBundleVersions: OTA_BACKEND_CONFIG.maxBundleVersions,
        metadata: {
          source: 'backend-manifest',
          version,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to download or install update.';
      setStatus('error');
      setDownloadProgress(0);
      setMessage(errorMessage);
    }
  }, []);

  const clearAllBundles = useCallback(async () => {
    if (isClearingBundles) {
      return;
    }

    setIsClearingBundles(true);
    setMessage('Clearing all downloaded bundles...');

    try {
      const success = await OtaHotUpdate.clearAllBundles();

      if (success) {
        pendingUpdateRef.current = null;
        setCurrentVersion(0);
        setDownloadProgress(0);
        setMessage('All bundles cleared. Restarting app...');
        OtaHotUpdate.resetApp();
        return;
      }

      setStatus('error');
      setMessage('Failed to clear bundles. Please try again.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to clear bundles. Please try again.';
      setStatus('error');
      setMessage(errorMessage);
    } finally {
      setIsClearingBundles(false);
    }
  }, [isClearingBundles]);

  return useMemo(
    () => ({
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
    }),
    [
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
    ],
  );
};
