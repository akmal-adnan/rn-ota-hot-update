import {NavigatorScreenParams} from '@react-navigation/native';

import {ROUTES} from '../constants/routes';

export type HomeStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.ACCOUNT_DETAILS]: {accountId: string} | undefined;
};

export type RootTabParamList = {
  [ROUTES.DASHBOARD_STACK]: NavigatorScreenParams<HomeStackParamList>;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.CHECK_UPDATE]: undefined;
  [ROUTES.CHECK_UPDATE_BACKEND]: undefined;
};
