import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {BodyExplorerView} from '../../features/science/presentation/components';
import {BODY_PARTS} from '../../features/science/domain/catalog/scienceData';
import {recordTopicCompletion} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'HumanBodyLesson'>;

const BODY_CHALLENGES = [
  {
    id: 'c1',
    promptKey: 'science.body.challengeSee',
    targetPartId: 'eyes',
    emoji: '👁️',
  },
  {
    id: 'c2',
    promptKey: 'science.body.challengeHear',
    targetPartId: 'ears',
    emoji: '👂',
  },
  {
    id: 'c3',
    promptKey: 'science.body.challengePump',
    targetPartId: 'heart',
    emoji: '❤️',
  },
  {
    id: 'c4',
    promptKey: 'science.body.challengeBreathe',
    targetPartId: 'lungs',
    emoji: '🫁',
  },
];

export function HumanBodyLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedChallengePart, setSelectedChallengePart] = useState<
    string | null
  >(null);
  const [_challengeScore, setChallengeScore] = useState(0);

  const currentChallenge = BODY_CHALLENGES[challengeIdx] ?? BODY_CHALLENGES[0];

  const handleChallengePick = (partId: string) => {
    setSelectedChallengePart(partId);
    if (partId === currentChallenge.targetPartId) {
      setChallengeScore(s => s + 1);
    }
  };

  const nextChallenge = () => {
    setSelectedChallengePart(null);
    if (challengeIdx < BODY_CHALLENGES.length - 1) {
      setChallengeIdx(i => i + 1);
    }
  };

  const handleFinish = () => {
    recordTopicCompletion('human-body', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'human-body',
      stars: 3,
      title: t('science.topics.humanBody.title', 'Human Body'),
      nextTopicId: 'animals',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFF1F2">
      <LearningHeader
        title={t('science.topics.humanBody.title', 'Human Body')}
        emoji="🧍"
        accentColor="#F43F5E"
        titleColor="#F43F5E"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Section 1: Body Map Explorer */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🧍 {t('science.body.exploreTitle', 'Explore Your Body')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t(
              'science.body.exploreDesc',
              'Tap parts to see what superpowers they have!',
            )}
          </Text>
        </View>

        <BodyExplorerView />

        {/* Section 2: Interactive Challenge Game */}
        <View style={styles.challengeBox}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeBadge}>
              🎮 {t('science.body.challengeTitle', 'Body Quiz Game')}
            </Text>
            <Text style={styles.challengeCount}>
              {challengeIdx + 1}/{BODY_CHALLENGES.length}
            </Text>
          </View>

          <Text style={styles.challengePrompt}>
            {t(currentChallenge.promptKey, 'Tap the body part:')}
          </Text>

          <View style={styles.challengeGrid}>
            {BODY_PARTS.slice(0, 6).map(part => {
              const isSelected = selectedChallengePart === part.id;
              const isCorrect = part.id === currentChallenge.targetPartId;
              let btnStyle = styles.cBtn;
              if (selectedChallengePart) {
                if (isCorrect) {
                  btnStyle = [styles.cBtn, styles.cBtnCorrect];
                } else if (isSelected && !isCorrect) {
                  btnStyle = [styles.cBtn, styles.cBtnWrong];
                }
              }

              return (
                <Pressable
                  key={part.id}
                  accessibilityRole="button"
                  disabled={selectedChallengePart !== null}
                  onPress={() => handleChallengePick(part.id)}
                  style={btnStyle}>
                  <Text style={styles.cEmoji}>{part.emoji}</Text>
                  <Text style={styles.cName}>{t(part.nameKey, part.id)}</Text>
                </Pressable>
              );
            })}
          </View>

          {selectedChallengePart && (
            <View style={styles.feedbackWrap}>
              <Text style={styles.feedbackText}>
                {selectedChallengePart === currentChallenge.targetPartId
                  ? '🎉 Correct! Awesome knowledge!'
                  : '💡 Keep trying! Check the explorer above.'}
              </Text>
              {challengeIdx < BODY_CHALLENGES.length - 1 ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={nextChallenge}
                  style={styles.nextBtn}>
                  <Text style={styles.nextBtnText}>Next Question ❯</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>

        {/* Complete Lesson Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Body Lesson')} ⭐⭐⭐
          </Text>
        </Pressable>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    gap: 18,
  },
  sectionHeader: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#881337',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E11D48',
    marginTop: 2,
  },
  challengeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FECDD3',
    gap: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: '#BE123C',
  },
  challengeCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E11D48',
  },
  challengePrompt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#881337',
    textAlign: 'center',
  },
  challengeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  cBtn: {
    width: '30%',
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE4E6',
  },
  cBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  cBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  cEmoji: {
    fontSize: 28,
  },
  cName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#881337',
    marginTop: 2,
  },
  feedbackWrap: {
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  nextBtn: {
    backgroundColor: '#F43F5E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  finishBtn: {
    backgroundColor: '#F43F5E',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
