import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {GKQuizEngine} from '../../features/generalKnowledge/presentation/components';
import {GRAND_GK_CHALLENGE_QUESTIONS} from '../../features/generalKnowledge/domain/catalog/gkData';
import {recordGrandChallengeScore} from '../../features/generalKnowledge/data/progress/gkProgress';
import type {GeneralKnowledgeStackParamList} from '../../navigation/generalKnowledgeTypes';

type Nav = NativeStackNavigationProp<
  GeneralKnowledgeStackParamList,
  'FinalChallenge'
>;

export function GKFinalQuizScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [completed, setCompleted] = useState(false);
  const [finalStars, setFinalStars] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const handleFinish = useCallback((score: number, stars: number) => {
    recordGrandChallengeScore(score);
    setFinalScore(score);
    setFinalStars(stars);
    setCompleted(true);
  }, []);

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FDF4FF">
      <LearningHeader
        title={t('generalKnowledge.challenge.title', 'GK Master Arena')}
        subtitle="10 Mixed Questions"
        emoji="🎯"
        accentColor="#7C3AED"
        titleColor="#7C3AED"
      />

      {!completed ? (
        <GKQuizEngine
          questions={GRAND_GK_CHALLENGE_QUESTIONS}
          accentColor="#7C3AED"
          onFinish={handleFinish}
        />
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.trophyCircle}>
            <Text style={styles.trophyEmoji}>🏆 🌟</Text>
          </View>

          <Text style={styles.title}>
            {t('generalKnowledge.challengeComplete.title', 'GK Champion Star!')}
          </Text>
          <Text style={styles.scoreText}>
            You scored {finalScore} / {GRAND_GK_CHALLENGE_QUESTIONS.length}!
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3].map(s => (
              <Text
                key={s}
                style={[
                  styles.star,
                  s <= finalStars ? styles.starFilled : styles.starEmpty,
                ]}>
                ⭐
              </Text>
            ))}
          </View>

          <View style={styles.badgeBox}>
            <Text style={styles.badgeEmoji}>🏆 🧠</Text>
            <Text style={styles.badgeText}>
              {t(
                'generalKnowledge.challengeBadgeUnlocked',
                'Check your Badges tab to see your GK Champion Award!',
              )}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Home')}
            style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>
              🏠 {t('generalKnowledge.backToHub', 'Back to GK Hub')}
            </Text>
          </Pressable>
        </View>
      )}
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  trophyCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F3E8FF',
    borderWidth: 4,
    borderColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  trophyEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#581C87',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C3AED',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
  },
  star: {
    fontSize: 40,
  },
  starFilled: {
    transform: [{scale: 1.15}],
  },
  starEmpty: {
    opacity: 0.25,
  },
  badgeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#D8B4FE',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#581C87',
    textAlign: 'center',
  },
  homeBtn: {
    backgroundColor: '#7C3AED',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7C3AED',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
