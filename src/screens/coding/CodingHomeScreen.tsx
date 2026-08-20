import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {CODING_TOPIC_CARDS} from '../../features/coding/domain/catalog/codingData';
import {readCodingProgress} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';
import type {
  CodingProgress,
  CodingTopicId,
} from '../../features/coding/domain/entities/codingEntities';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'Home'>;

export function CodingHomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<CodingProgress>(readCodingProgress);

  useFocusEffect(
    useCallback(() => {
      setProgress(readCodingProgress());
    }, []),
  );

  const completedCount = Object.values(progress.topicsProgress).filter(
    tp => tp.completed,
  ).length;
  const progressPercent = Math.round(
    (completedCount / CODING_TOPIC_CARDS.length) * 100,
  );

  const handleOpenTopic = (topicId: CodingTopicId) => {
    switch (topicId) {
      case 'robot':
        navigation.navigate('RobotGrid');
        break;
      case 'instructions':
        navigation.navigate('InstructionsLesson');
        break;
      case 'sequencing':
        navigation.navigate('SequencingLesson');
        break;
      case 'loops':
        navigation.navigate('RepetitionLesson');
        break;
      case 'conditionals':
        navigation.navigate('ConditionalsLesson');
        break;
      case 'debugging':
        navigation.navigate('DebuggingLesson');
        break;
      case 'challenge':
        navigation.navigate('CodingChallenge');
        break;
    }
  };

  return (
    <AppSafeAreaView
      testID="coding-home-screen"
      backgroundImage={null}
      backgroundColor="#EEF2FF">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back', 'Back')}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerEmoji}>🧩</Text>
              <Text style={styles.headerTitle}>
                {t('coding.home.title', 'Logic & Coding')}
              </Text>
            </View>
            <Text style={styles.headerSub}>
              {t(
                'coding.home.subtitle',
                'Computational Thinking for 1st Standard',
              )}
            </Text>
          </View>

          <View style={styles.starPill}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starCount}>{progress.totalStars}</Text>
          </View>
        </View>

        {/* Hero Progress Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>
              🚀 {t('coding.home.heroTitle', 'Little Coder Adventure')}
            </Text>
            <Text style={styles.heroSubtitle}>
              {completedCount} of {CODING_TOPIC_CARDS.length} topics mastered (
              {progressPercent}%)
            </Text>
            {/* Progress Track */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.max(6, progressPercent)}%`},
                ]}
              />
            </View>
          </View>
          <Text style={styles.heroRobotEmoji}>🤖</Text>
        </View>

        {/* 7 Interactive Topic Cards */}
        <Text style={styles.sectionTitle}>
          {t('coding.home.topicsHeader', 'Choose a Coding Game:')}
        </Text>

        <View style={styles.cardsGrid}>
          {CODING_TOPIC_CARDS.map(card => {
            const topicProg = progress.topicsProgress[card.id];
            const isCompleted = topicProg?.completed ?? false;
            const stars = topicProg?.stars ?? 0;

            return (
              <Pressable
                key={card.id}
                accessibilityRole="button"
                onPress={() => handleOpenTopic(card.id)}
                style={({pressed}) => [
                  styles.topicCard,
                  {borderColor: card.accentColor},
                  pressed && styles.topicCardPressed,
                ]}>
                <View
                  style={[
                    styles.cardIconWrap,
                    {backgroundColor: `${card.accentColor}20`},
                  ]}>
                  <Text style={styles.cardEmoji}>{card.emoji}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.tagBadge,
                        {backgroundColor: card.accentColor},
                      ]}>
                      <Text style={styles.tagBadgeText}>{card.badgeTag}</Text>
                    </View>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>⭐ {stars} ★</Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[styles.cardTitle, {color: card.accentColor}]}
                    numberOfLines={1}>
                    {t(card.titleKey, card.id)}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={2}>
                    {t(card.subtitleKey, '')}
                  </Text>
                </View>

                <Text style={styles.cardChevron}>❯</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtnText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 32,
    marginTop: -2,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starIcon: {
    fontSize: 14,
  },
  starCount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTextWrap: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 4,
  },
  heroRobotEmoji: {
    fontSize: 46,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E1B4B',
    marginTop: 4,
  },
  cardsGrid: {
    gap: 12,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topicCardPressed: {
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  completedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  completedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#B45309',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 15,
  },
  cardChevron: {
    fontSize: 16,
    fontWeight: '900',
    color: '#94A3B8',
  },
});
