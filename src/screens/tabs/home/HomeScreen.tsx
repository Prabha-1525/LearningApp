import {useEffect, useMemo} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {getChildAvatar, avatarLion} from '@assets';
import {AppSafeAreaView} from '@components';
import {isModuleId} from '@core/domain';
import {CelebrationOverlay} from '@core/gamification';
import {
  clearCelebrations,
  ensureGamificationChild,
  shiftCelebration,
} from '@core/store';
import {
  getMissingProgress,
  missingCompletionPercent,
} from '@features/math/data/missingProgress';
import {space} from '@shared/ui';

import type {MainStackParamList, MainTabParamList} from '@navigation/types';

import {HOME_SUBJECTS} from './homeCatalog';
import {HOME_GRID_GAP, HOME_H_PAD, HomeSubjectCard} from './HomeSubjectCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<MainStackParamList>
>;

/**
 * Home after profile setup — child greeting + subject grid (design mock).
 */
export function HomeScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const gamification = useAppSelector(state => state.gamification);
  const activeChildId = useAppSelector(state => state.profile.activeChildId);
  const activeChild = useAppSelector(state =>
    state.profile.children.find(
      child => child.id === state.profile.activeChildId,
    ),
  );

  useEffect(() => {
    if (activeChildId) {
      dispatch(ensureGamificationChild(activeChildId));
    }
  }, [dispatch, activeChildId]);

  const childName = activeChild?.displayName ?? t('home.defaultChildName');
  const celebration = gamification.pendingCelebrations[0] ?? null;
  const stars = gamification.snapshot?.wallet?.stars ?? 0;
  const level = gamification.snapshot?.xp?.level ?? 1;
  const lessonsDone = getMissingProgress().completedLessonIndexes.length;
  const mathProgress = missingCompletionPercent();
  const avatar = useMemo(
    () => getChildAvatar(activeChild?.avatarKey ?? 'lion'),
    [activeChild?.avatarKey],
  );

  const onPlay = (moduleId: string) => {
    if (isModuleId(moduleId)) {
      navigation.navigate('ModuleHost', {moduleId});
    }
  };

  return (
    <AppSafeAreaView
      testID="home-screen"
      backgroundImage={null}
      backgroundColor="#F4F7FA"
      padded={false}
      edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.identity}>
            {avatar.image ? (
              <Image source={avatar.image} style={styles.avatar} />
            ) : (
              <View style={styles.avatarEmoji}>
                <Text style={styles.emoji}>{avatar.emoji}</Text>
              </View>
            )}
            <View style={styles.brandBlock}>
              <Text style={styles.hello}>
                {t('home.helloName', {name: childName.toUpperCase()})}
              </Text>
              <Text style={styles.brand}>{t('home.brand')}</Text>
            </View>
          </View>
          <View style={styles.starsPill}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.starsValue}>{stars}</Text>
          </View>
        </View>

        <View style={styles.progressStrip}>
          <Text style={styles.progressStripItem}>
            {t('home.totalStars', {count: stars})}
          </Text>
          <Text style={styles.progressStripDot}>·</Text>
          <Text style={styles.progressStripItem}>
            {t('home.lessonsDone', {count: lessonsDone})}
          </Text>
          <Text style={styles.progressStripDot}>·</Text>
          <Text style={styles.progressStripItem}>
            {t('home.levelLabel', {level})}
          </Text>
        </View>

        <Text style={styles.prompt}>
          {t('home.promptLead')}{' '}
          <Text style={styles.promptAccent}>{t('home.promptAccent')}</Text>
        </Text>

        <View style={styles.grid}>
          {HOME_SUBJECTS.map(subject => (
            <HomeSubjectCard
              key={subject.id}
              title={t(subject.titleKey, {defaultValue: subject.id})}
              image={subject.image}
              progressPercent={
                subject.id === 'math' ? mathProgress : subject.progressPercent
              }
              showNewBadge={subject.showNewBadge}
              playLabel={t('home.play')}
              onPress={() => onPlay(subject.moduleId)}
              testID={`home-subject-${subject.id}`}
            />
          ))}
        </View>

        <View style={styles.moreGames}>
          <Text style={styles.moreTitle}>{t('home.moreGames')}</Text>
          <Text style={styles.moreSoon}>{t('home.comingSoon')}!</Text>
        </View>

        <View style={styles.tipBubble}>
          <Text style={styles.tipText}>{t('home.motivationTip')}</Text>
        </View>
        <View style={styles.tipTail} />

        <View style={styles.mascotWrap}>
          <Image
            source={avatarLion}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <CelebrationOverlay
        event={celebration}
        onDone={() => {
          if (gamification.pendingCelebrations.length <= 1) {
            dispatch(clearCelebrations());
          } else {
            dispatch(shiftCelebration());
          }
        }}
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: HOME_H_PAD,
    paddingTop: space.sm,
    paddingBottom: space.xxl,
    gap: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarEmoji: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF6E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 26},
  brandBlock: {
    flex: 1,
    gap: 2,
  },
  hello: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#7A8694',
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  progressStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  progressStripItem: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A5568',
  },
  progressStripDot: {
    color: '#CBD5E1',
    fontWeight: '800',
  },
  starIcon: {
    fontSize: 16,
    color: '#F5C518',
  },
  starsValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  prompt: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2A4A',
    lineHeight: 34,
    marginTop: 4,
  },
  promptAccent: {
    color: '#C4A05A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: HOME_GRID_GAP,
    marginTop: 4,
  },
  moreGames: {
    marginTop: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C5D0DB',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 2,
  },
  moreTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A5568',
  },
  moreSoon: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9AA6B2',
  },
  tipBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipTail: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  mascotWrap: {
    alignItems: 'center',
    marginTop: -4,
  },
  mascot: {
    width: 200,
    height: 180,
  },
});
