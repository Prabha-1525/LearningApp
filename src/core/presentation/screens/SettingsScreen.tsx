import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {setLocale, setSoundEnabled, setThemeMode} from '@core/store';
import {changeAppLanguage} from '@shared/i18n';
import {
  AppShell,
  AppText,
  ParentGateSheet,
  SettingGroup,
  SettingRow,
  TopAppBar,
  space,
  useTheme,
} from '@shared/ui';

import type {MainStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

export function SettingsScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {theme, radius} = useTheme();
  const settings = useAppSelector(state => state.settings);
  const [parentGateVisible, setParentGateVisible] = useState(false);

  return (
    <AppShell testID="settings-screen">
      <TopAppBar
        title={t('settings.title')}
        onBack={() => navigation.goBack()}
        showAudio
        soundEnabled={settings.soundEnabled}
        onToggleSound={value => dispatch(setSoundEnabled(value))}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <SettingGroup title={t('settings.title')}>
          <SettingRow
            label={t('settings.sound')}
            value={settings.soundEnabled}
            onValueChange={value => dispatch(setSoundEnabled(value))}
          />
          <SettingRow
            label={t('settings.nightMode')}
            value={settings.themeMode === 'night'}
            onValueChange={enabled =>
              dispatch(setThemeMode(enabled ? 'night' : 'light'))
            }
            gated
          />
          <SettingRow
            label={t('settings.language')}
            description={t('settings.languageHint')}
            value={settings.locale === 'ta'}
            onValueChange={async enabled => {
              const next = enabled ? 'ta' : 'en';
              dispatch(setLocale(next));
              await changeAppLanguage(next);
            }}
          />
        </SettingGroup>

        <SettingGroup title={t('settings.parentSection')}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('settings.openParentDashboard')}
            onPress={() => setParentGateVisible(true)}
            style={[
              styles.parentRow,
              {
                borderBottomColor: theme.colors.border,
              },
            ]}>
            <View style={styles.parentCopy}>
              <AppText variant="bodyStrong" tone="ink">
                {t('settings.openParentDashboard')}
              </AppText>
              <AppText variant="caption" tone="muted">
                {t('parent.gateMessage')}
              </AppText>
            </View>
            <View
              style={[
                styles.chevron,
                {
                  backgroundColor: theme.colors.sand,
                  borderRadius: radius.pill,
                },
              ]}>
              <AppText variant="headline" tone="primary">
                →
              </AppText>
            </View>
          </Pressable>
        </SettingGroup>
      </ScrollView>

      <ParentGateSheet
        visible={parentGateVisible}
        onCancel={() => setParentGateVisible(false)}
        onConfirm={() => {
          setParentGateVisible(false);
          navigation.navigate('ProgressOverview');
        }}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.lg,
    paddingBottom: space.xxxl,
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: space.sm,
  },
  parentCopy: {
    flex: 1,
    gap: 2,
  },
  chevron: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
