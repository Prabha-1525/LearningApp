import {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useAppDispatch} from '@app/store';
import {
  welcomeChessIcon,
  welcomeEnglishIcon,
  welcomeMathIcon,
  welcomeRewardsIcon,
} from '@assets';
import {AppSafeAreaView, GoogleButton, GuestButton} from '@components';
import {signInWithGoogleFlow, beginGuestSetup} from '@infrastructure/auth';
import {space} from '@shared/ui';

type WelcomeScreenProps = {
  readonly authError?: string | null;
  readonly onAuthErrorCleared?: () => void;
  readonly onNeedsChildSetup: () => void;
  readonly onReady: () => void;
  readonly onMergePrompt: () => void;
};

type SubjectTile = {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: ImageSourcePropType;
  readonly backgroundColor: string;
  readonly labelColor: string;
};

const SUBJECT_TILES: readonly SubjectTile[] = [
  {
    id: 'math',
    labelKey: 'welcome.subjects.math',
    icon: welcomeMathIcon,
    backgroundColor: '#7EC8F5',
    labelColor: '#1B4F72',
  },
  {
    id: 'english',
    labelKey: 'welcome.subjects.english',
    icon: welcomeEnglishIcon,
    backgroundColor: '#7BC96F',
    labelColor: '#1E5C2A',
  },
  {
    id: 'chess',
    labelKey: 'welcome.subjects.chess',
    icon: welcomeChessIcon,
    backgroundColor: '#F5A623',
    labelColor: '#7A3E00',
  },
  {
    id: 'rewards',
    labelKey: 'welcome.subjects.rewards',
    icon: welcomeRewardsIcon,
    backgroundColor: '#F5B8C8',
    labelColor: '#8B2E4A',
  },
];

export function WelcomeScreen({
  authError,
  onAuthErrorCleared,
  onNeedsChildSetup,
  onReady,
  onMergePrompt,
}: WelcomeScreenProps) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onGooglePress = async () => {
    onAuthErrorCleared?.();
    setLoading(true);
    const result = await signInWithGoogleFlow(dispatch);
    setLoading(false);
    if (!result.ok) {
      const message = result.error.message.includes('cancelled')
        ? t('welcome.errors.cancelled')
        : result.error.message.toLowerCase().includes('network')
        ? t('welcome.errors.network')
        : t('welcome.errors.generic');
      Alert.alert(t('welcome.errors.title'), message);
      return;
    }
    if (result.value.kind === 'ready') {
      onReady();
      return;
    }
    if (result.value.kind === 'mergePrompt') {
      onMergePrompt();
      return;
    }
    onNeedsChildSetup();
  };

  const onGuestPress = () => {
    beginGuestSetup();
    onNeedsChildSetup();
  };

  return (
    <AppSafeAreaView
      testID="welcome-screen"
      backgroundImage={null}
      backgroundColor="#D9F0FA"
      statusBarStyle="dark-content"
      padded>
      <View style={styles.cloudTop} pointerEvents="none" />
      <View style={styles.cloudMid} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandTitle} accessibilityRole="header">
            <Text style={styles.brandLearning}>
              {t('welcome.brandLearning')}
            </Text>
            <Text style={styles.brandApp}> {t('welcome.brandApp')}</Text>
          </Text>
          <Text style={styles.tagline}>{t('welcome.tagline')}</Text>
        </View>

        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>{t('welcome.hello')}</Text>
          <Text style={styles.greetingSubtitle}>
            {t('welcome.helloSubtitle')}
          </Text>
        </View>

        <View style={styles.grid}>
          {SUBJECT_TILES.map(tile => (
            <View
              key={tile.id}
              style={[styles.tile, {backgroundColor: tile.backgroundColor}]}>
              <Image
                source={tile.icon}
                style={styles.tileIcon}
                resizeMode="contain"
              />
              <Text style={[styles.tileLabel, {color: tile.labelColor}]}>
                {t(tile.labelKey)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
          <GoogleButton
            label={t('welcome.continueGoogle')}
            helperText={t('welcome.googleHelper')}
            loading={loading}
            onPress={() => {
              void onGooglePress();
            }}
          />
          <GuestButton
            label={t('welcome.continueGuest')}
            helperText={t('welcome.guestHelper')}
            disabled={loading}
            onPress={onGuestPress}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.safeKids}>{t('welcome.safeForKids')}</Text>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  cloudTop: {
    position: 'absolute',
    top: 24,
    right: -40,
    width: 160,
    height: 100,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  cloudMid: {
    position: 'absolute',
    top: 90,
    left: -50,
    width: 140,
    height: 90,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  scroll: {paddingBottom: space.xxxl, gap: space.md},
  brandBlock: {alignItems: 'center', marginTop: space.sm, gap: 4},
  brandTitle: {fontSize: 34, fontWeight: '800', letterSpacing: -0.5},
  brandLearning: {color: '#F4A020'},
  brandApp: {color: '#5BB8E8'},
  tagline: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#2C3E50',
  },
  greetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
  },
  greetingSubtitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    color: '#5B6B74',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space.sm,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.sm,
    gap: 6,
  },
  tileIcon: {width: '72%', height: '58%'},
  tileLabel: {fontSize: 18, fontWeight: '800'},
  actions: {gap: space.md, marginTop: space.sm},
  errorText: {
    textAlign: 'center',
    color: '#D64545',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {alignItems: 'center', marginTop: space.sm},
  safeKids: {fontSize: 15, fontWeight: '700', color: '#2E7D4F'},
});
