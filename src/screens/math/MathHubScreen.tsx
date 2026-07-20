import {useCallback, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppSelector} from '@app/store';
import {getChildAvatar, leoWave} from '@assets';
import {AppSafeAreaView} from '@components';
import {
  accuracy,
  getMathProgress,
  getLessonStats,
  globalAccuracy,
} from '@features/math/data/mathProgress';
import {MATH_ADVENTURE_TOPICS} from '@features/math/domain/curriculum';
import type {MathStackParamList} from '@navigation/mathTypes';
import {BackButton, space} from '@shared/ui';

import {
  MATH_TOPIC_GRID_GAP,
  MATH_TOPIC_H_PAD,
  MathTopicCard,
} from './MathTopicCard';

type Props = NativeStackScreenProps<MathStackParamList, 'Hub'>;

type HubTab = 'play' | 'map' | 'awards' | 'coach';

/**
 * MathAdventure hub — Leo greeting, overall progress, topic grid.
 */
export function MathHubScreen({navigation}: Props) {
  const {t, i18n} = useTranslation();
  const [progress, setProgress] = useState(getMathProgress);
  const [tab, setTab] = useState<HubTab>('play');
  const gamification = useAppSelector(state => state.gamification);
  const activeChild = useAppSelector(state =>
    state.profile.children.find(
      child => child.id === state.profile.activeChildId,
    ),
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(getMathProgress());
    }, []),
  );

  const stars = gamification.snapshot?.wallet?.stars ?? 0;
  const overallPercent = globalAccuracy(progress);
  const isTamil = i18n.language?.toLowerCase().startsWith('ta');
  const avatar = useMemo(
    () => getChildAvatar(activeChild?.avatarKey ?? 'lion'),
    [activeChild?.avatarKey],
  );

  const onPlayTopic = (lessonId: string | undefined, comingSoon?: boolean) => {
    if (comingSoon || !lessonId) {
      return;
    }
    navigation.navigate('Lesson', {lessonId});
  };

  return (
    <AppSafeAreaView
      testID="math-hub-screen"
      backgroundImage={null}
      backgroundColor="#EAF1F6"
      padded={false}
      edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <BackButton
          label={t('common.back')}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{t('math.hub.title')}</Text>
        <View style={styles.headerRight}>
          <View style={styles.coinPill}>
            <Text style={styles.coinIcon}>★</Text>
            <Text style={styles.coinValue}>{stars}</Text>
          </View>
          {avatar.image ? (
            <Image source={avatar.image} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.greetingRow}>
          <Image source={leoWave} style={styles.leo} resizeMode="contain" />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {t('math.hub.leoGreeting')}{' '}
              <Text style={styles.bubbleAccent}>
                {t('math.hub.leoGreetingAccent')}
              </Text>{' '}
              {t('math.hub.leoGreetingTail')}
            </Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {t('math.hub.overallProgress')}
            </Text>
            <Text style={styles.progressPercent}>
              {t('math.hub.overallComplete', {percent: overallPercent})}
            </Text>
          </View>
          <View style={styles.overallTrack}>
            <View style={[styles.overallFill, {width: `${overallPercent}%`}]} />
          </View>
        </View>

        {tab === 'play' ? (
          <View style={styles.grid}>
            {MATH_ADVENTURE_TOPICS.map(topic => {
              const stats =
                topic.lessonId != null ? getLessonStats(topic.lessonId) : null;
              const livePercent =
                stats != null && stats.attempted > 0
                  ? accuracy(stats)
                  : topic.demoProgressPercent;
              const title = isTamil ? topic.titleTa : topic.titleEn;

              return (
                <MathTopicCard
                  key={topic.id}
                  title={title}
                  image={topic.image}
                  emoji={topic.icon}
                  heroColor={topic.heroColor}
                  progressPercent={livePercent}
                  playLabel={t('math.hub.play')}
                  comingSoon={topic.comingSoon}
                  comingSoonLabel={t('math.hub.comingSoon')}
                  onPress={() => onPlayTopic(topic.lessonId, topic.comingSoon)}
                  testID={`math-topic-${topic.id}`}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.placeholderTab}>
            <Text style={styles.placeholderTitle}>
              {t(`math.hub.tabs.${tab}`)}
            </Text>
            <Text style={styles.placeholderBody}>
              {t('math.hub.tabComingSoon')}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        {(
          [
            {id: 'play', label: t('math.hub.tabs.play'), symbol: '✚'},
            {id: 'map', label: t('math.hub.tabs.map'), symbol: '🗺'},
            {id: 'awards', label: t('math.hub.tabs.awards'), symbol: '🏆'},
            {id: 'coach', label: t('math.hub.tabs.coach'), symbol: '☺'},
          ] as const
        ).map(item => {
          const active = tab === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setTab(item.id)}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{selected: active}}>
              <Text
                style={[styles.tabSymbol, active && styles.tabSymbolActive]}>
                {item.symbol}
              </Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: MATH_TOPIC_H_PAD,
    paddingTop: space.xs,
    paddingBottom: space.sm,
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2ECC71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  coinIcon: {
    color: '#FFF4A3',
    fontSize: 14,
    fontWeight: '800',
  },
  coinValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF6E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {fontSize: 18},
  content: {
    paddingHorizontal: MATH_TOPIC_H_PAD,
    paddingBottom: space.xl,
    gap: space.md,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leo: {
    width: 88,
    height: 110,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#3A4A5C',
  },
  bubbleAccent: {
    fontWeight: '800',
    color: '#1A2A4A',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#1D4ED8',
    flex: 1,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },
  overallTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E6EBF0',
    overflow: 'hidden',
  },
  overallFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4CAF50',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MATH_TOPIC_GRID_GAP,
  },
  placeholderTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  placeholderBody: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7A88',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8EEF4',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabSymbol: {
    fontSize: 18,
    color: '#9AA6B2',
  },
  tabSymbolActive: {
    color: '#1D4ED8',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AA6B2',
  },
  tabLabelActive: {
    color: '#1D4ED8',
  },
});
