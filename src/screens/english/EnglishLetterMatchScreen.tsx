import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  EnglishHeader,
  EnglishQuizEngine,
  LetterMatchGame,
} from '../../features/english/presentation/components';
import {
  LETTER_MATCH_PAIRS,
  SUBMODULE_QUIZZES,
} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'CapitalSmall'>;

export function EnglishLetterMatchScreen() {
  const navigation = useNavigation<Nav>();
  const [mode, setMode] = useState<'practice' | 'quiz'>('practice');

  const quizQuestions = SUBMODULE_QUIZZES.capital_small;

  const handleFinishPractice = (stars: number) => {
    recordEnglishLessonResult(
      'capital_small',
      'capital_small_match',
      stars,
      stars * 10,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'capital_small',
      title: 'Capital & Small Match Star',
      stars,
      score: stars * 10,
      totalQuestions: LETTER_MATCH_PAIRS.length,
      nextSubModuleId: 'letter_sounds',
    });
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordEnglishLessonResult(
      'capital_small',
      'capital_small_quiz',
      stars,
      score,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'capital_small',
      title: 'Letter Matcher Pro',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'letter_sounds',
    });
  };

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="Capital & Small"
        subtitle="Match uppercase with lowercase letters!"
        emoji="🔠"
        accentColor="#8B5CF6"
      />

      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('practice')}
          style={[styles.tabBtn, mode === 'practice' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              mode === 'practice' && styles.tabBtnTextActive,
            ]}>
            🎮 Match Game
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('quiz')}
          style={[styles.tabBtn, mode === 'quiz' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              mode === 'quiz' && styles.tabBtnTextActive,
            ]}>
            🎯 3-Question Quiz
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {mode === 'practice' ? (
          <LetterMatchGame
            pairs={LETTER_MATCH_PAIRS.slice(0, 6)}
            onCompleted={handleFinishPractice}
          />
        ) : (
          <EnglishQuizEngine
            questions={quizQuestions}
            accentColor="#8B5CF6"
            onFinish={handleFinishQuiz}
          />
        )}
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#8B5CF6',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
