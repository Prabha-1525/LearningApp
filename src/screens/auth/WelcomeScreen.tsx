import {
  Image,
  Pressable,
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
import {AppSafeAreaView} from '@components';
import {setOnboardingComplete} from '@core/store';
import {space} from '@shared/ui';

type WelcomeScreenProps = {
  readonly onParentPress?: () => void;
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

const PARENT_BENEFITS = [
  'welcome.parentBenefits.save',
  'welcome.parentBenefits.restore',
  'welcome.parentBenefits.sync',
] as const;

/**
 * First-run welcome — brand, subject grid, parent Google sign-in card.
 * Top hero illustration omitted by design request.
 */
export function WelcomeScreen({onParentPress}: WelcomeScreenProps) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const enterApp = () => {
    dispatch(setOnboardingComplete(true));
  };

  const onGooglePress = () => {
    if (onParentPress) {
      onParentPress();
      return;
    }
    enterApp();
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
            <Pressable
              key={tile.id}
              testID={`welcome-tile-${tile.id}`}
              accessibilityRole="button"
              accessibilityLabel={t(tile.labelKey)}
              onPress={enterApp}
              style={({pressed}) => [
                styles.tile,
                {
                  backgroundColor: tile.backgroundColor,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <Image
                source={tile.icon}
                style={styles.tileIcon}
                resizeMode="contain"
              />
              <Text style={[styles.tileLabel, {color: tile.labelColor}]}>
                {t(tile.labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.parentCard}>
          <Text style={styles.parentTitle}>{t('welcome.parentSignIn')}</Text>
          <Pressable
            testID="welcome-google"
            accessibilityRole="button"
            accessibilityLabel={t('welcome.continueGoogle')}
            onPress={onGooglePress}
            style={({pressed}) => [
              styles.googleButton,
              pressed && styles.googleButtonPressed,
            ]}>
            <View style={styles.googleMark}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleLabel}>
              {t('welcome.continueGoogle')}
            </Text>
          </Pressable>
          <View style={styles.benefits}>
            {PARENT_BENEFITS.map(key => (
              <View key={key} style={styles.benefitRow}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.benefitText}>{t(key)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.safeKids}>{t('welcome.safeForKids')}</Text>
          <View style={styles.legalRow}>
            <Text style={styles.legalLink}>{t('welcome.privacy')}</Text>
            <Text style={styles.legalLink}>{t('welcome.terms')}</Text>
          </View>
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
  scroll: {
    paddingBottom: space.xxxl,
    gap: space.md,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: space.sm,
    gap: 4,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandLearning: {
    color: '#F4A020',
  },
  brandApp: {
    color: '#5BB8E8',
  },
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
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
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
  tileIcon: {
    width: '72%',
    height: '58%',
  },
  tileLabel: {
    fontSize: 18,
    fontWeight: '800',
  },
  parentCard: {
    backgroundColor: '#E8EEF5',
    borderRadius: 28,
    padding: space.lg,
    gap: space.md,
  },
  parentTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#2C3E50',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  googleButtonPressed: {
    opacity: 0.92,
  },
  googleMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleG: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  benefits: {
    gap: 8,
    paddingHorizontal: space.xs,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3D9A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  benefitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    marginTop: space.sm,
  },
  safeKids: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D4F',
  },
  legalRow: {
    flexDirection: 'row',
    gap: space.lg,
  },
  legalLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D4F',
    textDecorationLine: 'underline',
  },
});
