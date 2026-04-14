import {useCallback, useMemo, useRef, useState} from 'react';
import {Alert, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import OtaHotUpdate from 'react-native-ota-hot-update';

const OTA_CHECK_CONFIG = {
  // Strapi host, e.g. https://cms.example.com
  cmsBaseUrl: 'http://localhost:1337',
  // Public collection API IDs (plural) in Strapi.
  androidCollection: 'androids',
  iosCollection: 'ioss',
  // Native app version that OTA entries target.
  targetVersion: '1.0',
};

// Strapi v5: media objects are flat with `url` at top level.
// Multi-media fields return an array of these objects.
type StrapiMediaObject = {
  url?: string;
};

// Strapi v5: items are flat — no `attributes` wrapper.
type StrapiItem = {
  id?: number;
  documentId?: string;
  enable?: boolean;
  bundle?: StrapiMediaObject | StrapiMediaObject[];
};

type StrapiResponse = {
  data?: StrapiItem[];
};

type NormalizedStrapiItem = {
  id: number;
  enable: boolean;
  bundleUrl?: string;
};

const getBundleUrl = (item: StrapiItem): string | undefined => {
  const {bundle} = item;
  if (!bundle) {
    return undefined;
  }

  // Multi-media field: array of media objects
  if (Array.isArray(bundle)) {
    return bundle.find(m => m.url)?.url;
  }

  // Single media object
  return bundle.url;
};

const normalizeItems = (response: StrapiResponse): NormalizedStrapiItem[] => {
  const list = Array.isArray(response.data) ? response.data : [];

  return list
    .map(item => {
      const id = typeof item.id === 'number' ? item.id : 0;
      const enable = item.enable ?? true;

      return {
        id,
        enable,
        bundleUrl: getBundleUrl(item),
      };
    })
    .filter(item => item.id > 0);
};

const buildStrapiEndpoint = () => {
  const collection =
    Platform.OS === 'ios'
      ? OTA_CHECK_CONFIG.iosCollection
      : OTA_CHECK_CONFIG.androidCollection;
  const query = new URLSearchParams();

  query.append('populate', '*');
  query.append('sort', 'id:desc');
  query.append('filters[targetVersion][$eq]', OTA_CHECK_CONFIG.targetVersion);

  return `${OTA_CHECK_CONFIG.cmsBaseUrl.replace(
    /\/$/,
    '',
  )}/api/${collection}?${query.toString()}`;
};

type CheckUpdateStatus =
  | 'idle'
  | 'checking'
  | 'upToDate'
  | 'updateAvailable'
  | 'downloading'
  | 'installing'
  | 'installed'
  | 'error';

type CheckUpdateResult = {
  status: CheckUpdateStatus;
  checkedAt: Date | null;
  currentVersion: number | null;
  message: string;
  isConfigured: boolean;
  downloadProgress: number;
  checkForUpdates: () => Promise<void>;
  applyUpdate: () => Promise<void>;
};

const defaultMessage =
  'Ready to verify whether a newer OTA bundle is available.';

export const useCheckUpdate = (): CheckUpdateResult => {
  const [status, setStatus] = useState<CheckUpdateStatus>('idle');
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [message, setMessage] = useState(defaultMessage);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const isCheckingRef = useRef(false);
  const pendingUpdateRef = useRef<{bundleUrl: string; version: number} | null>(
    null,
  );

  const isConfigured = Boolean(
    OTA_CHECK_CONFIG.cmsBaseUrl && OTA_CHECK_CONFIG.targetVersion,
  );

  const checkForUpdates = useCallback(async () => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;

    const now = new Date();
    setStatus('checking');
    setMessage('Checking for update...');

    try {
      const version = await OtaHotUpdate.getCurrentVersion();
      setCurrentVersion(version);
    } catch {
      setCurrentVersion(null);
    }

    if (!isConfigured) {
      setStatus('error');
      setCheckedAt(now);
      setMessage(
        'Update check is not configured yet. Add your Strapi CMS URL and target version in useCheckUpdate.ts.',
      );
      isCheckingRef.current = false;
      return;
    }

    try {
      const endpoint = buildStrapiEndpoint();
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CMS request failed (${response.status}).`);
      }

      const json = (await response.json()) as StrapiResponse;
      const items = normalizeItems(json);
      const latestEnabled = items.find(item => item.enable);

      setCheckedAt(now);

      if (!latestEnabled) {
        setStatus('upToDate');
        setMessage(
          `No published OTA bundle found for target version ${OTA_CHECK_CONFIG.targetVersion}.`,
        );
        return;
      }

      if ((latestEnabled.id || 0) > (currentVersion || 0)) {
        if (latestEnabled.bundleUrl) {
          pendingUpdateRef.current = {
            bundleUrl: latestEnabled.bundleUrl,
            version: latestEnabled.id,
          };
        }
        setStatus('updateAvailable');
        setMessage(
          latestEnabled.bundleUrl
            ? `Update detected. New bundle version ${latestEnabled.id} is available.`
            : `Update metadata found (version ${latestEnabled.id}), but bundle URL is missing in CMS.`,
        );
        return;
      }

      setStatus('upToDate');
      setMessage('App is already up to date.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to check CMS for updates.';
      setStatus('error');
      setCheckedAt(now);
      setMessage(errorMessage);
    } finally {
      isCheckingRef.current = false;
    }
  }, [currentVersion, isConfigured]);

  const applyUpdate = useCallback(async () => {
    const pending = pendingUpdateRef.current;
    if (!pending) {
      setStatus('error');
      setMessage('No update available to install.');
      return;
    }

    const {bundleUrl, version} = pending;
    const fullUrl = bundleUrl.startsWith('http')
      ? bundleUrl
      : `${OTA_CHECK_CONFIG.cmsBaseUrl.replace(/\/$/, '')}${bundleUrl}`;

    setStatus('downloading');
    setDownloadProgress(0);
    setMessage(`Downloading bundle version ${version}...`);

    try {
      await OtaHotUpdate.downloadBundleUri(
        ReactNativeBlobUtil,
        fullUrl,
        version,
        {
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
        },
      );
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

  return useMemo(
    () => ({
      status,
      checkedAt,
      currentVersion,
      message,
      isConfigured,
      downloadProgress,
      checkForUpdates,
      applyUpdate,
    }),
    [
      status,
      checkedAt,
      currentVersion,
      message,
      isConfigured,
      downloadProgress,
      checkForUpdates,
      applyUpdate,
    ],
  );
};
