import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {ShieldCheck} from 'lucide-react-native';

import {useProfile} from '../hooks';
import {theme} from '../theme';
import {
  AppText,
  Avatar,
  Card,
  Divider,
  ProfileSecurityItem,
  Screen,
  SectionTitle,
  TrustBadge,
} from '../components';

const ListSeparator = () => <View style={styles.separator} />;

const riskColorMap: Record<string, string> = {
  Low: theme.colors.semantic.success,
  Medium: theme.colors.semantic.warning,
  High: theme.colors.semantic.danger,
};

export const Profile = () => {
  const {profileData, isLoading, error, toggleSecurity} = useProfile();

  return (
    <Screen noHeader>
      <View style={styles.headerWrap}>
        <SectionTitle
          title="Profile"
          subtitle="Identity and security controls"
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.base.yellow} />
        </View>
      ) : null}

      {error ? (
        <View style={styles.centered}>
          <AppText tone="secondary">{error}</AppText>
        </View>
      ) : null}

      {profileData ? (
        <FlatList
          data={profileData.security}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.listHeaderWrap}>
              <Card style={styles.profileCard} elevated>
                <View style={styles.profileTop}>
                  <Avatar name={profileData.profile.fullName} size="lg" />
                  <View style={styles.nameBlock}>
                    <AppText variant="subtitle">
                      {profileData.profile.fullName}
                    </AppText>
                    <AppText tone="muted" variant="caption">
                      {profileData.profile.email}
                    </AppText>
                  </View>
                  <TrustBadge variant="verified" />
                </View>

                <Divider style={styles.cardDivider} />

                <View style={styles.statsRow}>
                  <View>
                    <AppText variant="caption" tone="muted">
                      Member Since
                    </AppText>
                    <AppText style={styles.statValue}>
                      {profileData.profile.memberSince}
                    </AppText>
                  </View>
                  <View style={styles.riskWrap}>
                    <AppText variant="caption" tone="muted">
                      Risk Level
                    </AppText>
                    <View style={styles.riskRow}>
                      <ShieldCheck
                        size={14}
                        color={
                          riskColorMap[profileData.profile.riskLevel] ??
                          theme.colors.text.muted
                        }
                      />
                      <AppText
                        style={[
                          styles.statValue,
                          {
                            color:
                              riskColorMap[profileData.profile.riskLevel] ??
                              theme.colors.text.secondary,
                          },
                        ]}>
                        {profileData.profile.riskLevel}
                      </AppText>
                    </View>
                  </View>
                </View>
              </Card>

              <SectionTitle
                title="Security"
                subtitle="Control your protection layers"
              />
            </View>
          }
          renderItem={({item}) => (
            <ProfileSecurityItem item={item} onToggle={toggleSecurity} />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListSeparator}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    marginTop: theme.spacing.md,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  listHeaderWrap: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  profileCard: {
    borderColor: theme.colors.border.default,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  cardDivider: {
    marginVertical: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statValue: {
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
  riskWrap: {
    alignItems: 'flex-end',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  separator: {
    height: theme.spacing.sm,
  },
});
