import {useCallback, useMemo, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppSelector} from '@app/store';
import {getChildAvatar, leoWave} from '@assets';
import {AppSafeAreaView, LearningHeader} from '@components';
import {
  getMathProgress,
  getMathTopicProgress,
  getOverallMathAdventureProgress,
} from '@features/math/data';
import {MATH_ADVENTURE_TOPICS} from '@features/math/domain/curriculum';
import type {MathStackParamList} from '@navigation/mathTypes';
import {space} from '@shared/ui';

import {
  MATH_TOPIC_GRID_GAP,
  MATH_TOPIC_H_PAD,
  MathTopicCard,
} from './MathTopicCard';

type Props = NativeStackScreenProps<MathStackParamList, 'Hub'>;

/**
 * MathAdventure hub — Leo greeting, overall progress, topic grid.
 */
export function MathHubScreen({navigation}: Props) {
  const {t, i18n} = useTranslation();
  const [_progress, setProgress] = useState(getMathProgress);
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
  const overallPercent = getOverallMathAdventureProgress();
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
      <LearningHeader
        title={t('math.hub.title')}
        titleColor="#1D4ED8"
        stars={stars}
        starVariant="green"
        rightElement={
          avatar.image ? (
            <Image source={avatar.image} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
            </View>
          )
        }
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            const parent = navigation.getParent();
            if (parent) {
              (parent as any).navigate('Tabs', {screen: 'HomeTab'});
            }
          }
        }}
      />

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

        <View style={styles.grid}>
          {MATH_ADVENTURE_TOPICS.map(topic => {
            const livePercent = getMathTopicProgress(topic.id, topic.lessonId);
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
      </ScrollView>
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
});
