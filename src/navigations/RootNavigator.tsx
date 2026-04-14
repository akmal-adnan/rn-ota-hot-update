import React from 'react';
import {StyleSheet, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ArrowDownCircle, House, Server, ShieldCheck} from 'lucide-react-native';

import {ROUTES} from '../constants/routes';
import {theme} from '../theme';
import {
  AccountDetails,
  CheckUpdate,
  CheckUpdateBackend,
  Home,
  Profile,
} from '../screens';
import {HomeStackParamList, RootTabParamList} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: theme.colors.background.primary},
        headerTintColor: theme.colors.text.primary,
        headerShadowVisible: false,
        contentStyle: {backgroundColor: theme.colors.background.primary},
      }}>
      <HomeStack.Screen
        name={ROUTES.HOME}
        component={Home}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name={ROUTES.ACCOUNT_DETAILS}
        component={AccountDetails}
        options={{title: 'Account Details'}}
      />
    </HomeStack.Navigator>
  );
};

const HomeTabIcon = ({color, size}: {color: string; size: number}) => (
  <House color={color} size={size} />
);

const ProfileTabIcon = ({color, size}: {color: string; size: number}) => (
  <View style={styles.profileIconWrap}>
    <ShieldCheck color={color} size={size} />
  </View>
);

const CheckUpdateTabIcon = ({color, size}: {color: string; size: number}) => (
  <View style={styles.updateIconWrap}>
    <ArrowDownCircle color={color} size={size} />
  </View>
);

const CheckUpdateBackendTabIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => (
  <View style={styles.updateIconWrap}>
    <Server color={color} size={size} />
  </View>
);

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: theme.colors.base.yellow,
          tabBarInactiveTintColor: theme.colors.text.muted,
        }}>
        <Tab.Screen
          name={ROUTES.DASHBOARD_STACK}
          component={HomeStackNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: HomeTabIcon,
          }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE}
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ProfileTabIcon,
          }}
        />
        <Tab.Screen
          name={ROUTES.CHECK_UPDATE}
          component={CheckUpdate}
          options={{
            tabBarLabel: 'Check Update',
            tabBarIcon: CheckUpdateTabIcon,
          }}
        />
        <Tab.Screen
          name={ROUTES.CHECK_UPDATE_BACKEND}
          component={CheckUpdateBackend}
          options={{
            tabBarLabel: 'Backend OTA',
            tabBarIcon: CheckUpdateBackendTabIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background.elevated,
    borderTopColor: theme.colors.border.default,
    height: 72,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  profileIconWrap: {
    marginTop: 2,
  },
  updateIconWrap: {
    marginTop: 2,
  },
});
