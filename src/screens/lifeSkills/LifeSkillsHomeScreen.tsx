import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {LIFE_SKILLS_TOPIC_CARDS} from '../../features/lifeSkills/domain/catalog/lifeSkillsData';
import {readLifeSkillsProgress} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';
import type {
  LifeSkillsProgress,
  LifeSkillsTopicId,
} from '../../features/lifeSkills/domain/entities/lifeSkillsEntities';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'Home'>;

export function LifeSkillsHomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<LifeSkillsProgress>(
    readLifeSkillsProgress,
  );

  useFocusEffect(
    useCallback(() => {
      setProgress(readLifeSkillsProgress());
    }, []),
  );

  const completedCount = Object.values(progress.topicsProgress).filter(
    tp => tp.completed,
  ).length;
  const progressPercent = Math.round(
    (completedCount / LIFE_SKILLS_TOPIC_CARDS.length) * 100,
  );

  const handleOpenTopic = (topicId: LifeSkillsTopicId) => {
    switch (topicId) {
      case 'hygiene':
        navigation.navigate('Hygiene');
        break;
      case 'emotions':
        navigation.navigate('Emotions');
        break;
      case 'manners':
        navigation.navigate('Manners');
        break;
      case 'routine':
        navigation.navigate('DailyRoutine');
        break;
      case 'habits':
        navigation.navigate('HealthyHabits');
        break;
      case 'safety':
        navigation.navigate('Safety');
        break;
      case 'quiz':
        navigation.navigate('LifeSkillsQuiz');
        break;
    }
  };

  return (
    <AppSafeAreaView
      testID="life-skills-home-screen"
      backgroundImage={null}
      backgroundColor="#ECFDF5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {/* Header */}
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
              <Text style={styles.headerEmoji}>😊</Text>
              <Text style={styles.headerTitle}>
                {t('modules.lifeSkills.title', 'Life Skills')}
              </Text>
            </View>
            <Text style={styles.headerSub}>
              {t(
                'lifeSkills.home.subtitle',
                'Hygiene, Feelings, Manners & Good Habits',
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
              🌟 {t('lifeSkills.home.heroTitle', 'Kind & Healthy Super Kid')}
            </Text>
            <Text style={styles.heroSubtitle}>
              {completedCount} of {LIFE_SKILLS_TOPIC_CARDS.length} life skills
              practiced ({progressPercent}%)
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.max(6, progressPercent)}%`},
                ]}
              />
            </View>
          </View>
          <Text style={styles.heroEmoji}>🌱</Text>
        </View>

        {/* Topic Cards List */}
        <Text style={styles.sectionTitle}>
          {t('lifeSkills.home.sectionHeader', 'Explore Life Skills Topics:')}
        </Text>

        <View style={styles.cardsGrid}>
          {LIFE_SKILLS_TOPIC_CARDS.map(card => {
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
    color: '#065F46',
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
    backgroundColor: '#10B981',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
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
    color: '#D1FAE5',
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
    backgroundColor: '#FDE047',
    borderRadius: 4,
  },
  heroEmoji: {
    fontSize: 44,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065F46',
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
