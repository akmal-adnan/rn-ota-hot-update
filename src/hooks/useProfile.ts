import {useMemo, useState} from 'react';

import {securitySettings, userProfile} from '../data/mockBanking';
import {useAsyncResource} from './useAsyncResource';

type ProfileData = {
  profile: typeof userProfile;
  security: typeof securitySettings;
};

const fetchProfile = async (): Promise<ProfileData> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    profile: userProfile,
    security: securitySettings,
  };
};

export const useProfile = () => {
  const asyncState = useAsyncResource(fetchProfile);
  const [localSecurity, setLocalSecurity] = useState(securitySettings);

  const toggleSecurity = (securityId: string) => {
    setLocalSecurity(prev =>
      prev.map(item =>
        item.id === securityId ? {...item, enabled: !item.enabled} : item,
      ),
    );
  };

  return useMemo(
    () => ({
      ...asyncState,
      profileData: asyncState.data
        ? {...asyncState.data, security: localSecurity}
        : null,
      toggleSecurity,
    }),
    [asyncState, localSecurity],
  );
};
