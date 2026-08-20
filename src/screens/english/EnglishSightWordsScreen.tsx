import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  EnglishHeader,
  EnglishQuizEngine,
  SightWordFlashcard,
} from '../../features/english/presentation/components';
import {
  SIGHT_WORDS_DATA,
  SUBMODULE_QUIZZES,
} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'SightWords'>;

export function EnglishSightWordsScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentSightWord = SIGHT_WORDS_DATA[currentIdx] ?? SIGHT_WORDS_DATA[0];
  const quizQuestions = SUBMODULE_QUIZZES.sight_words ?? [];

  const handleFinishQuiz = (score: number, stars: number) => {
    recordEnglishLessonResult('sight_words', 'sight_words_quiz', stars, score);
    navigation.navigate('LessonComplete', {
      subModuleId: 'sight_words',
      title: 'Sight Word Explorer',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'sentence_reading',
    });
  };

  const handleNextWord = () => {
    setCurrentIdx(prev => (prev + 1) % SIGHT_WORDS_DATA.length);
  };

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="Sight Words"
        subtitle="Common words for smooth reading!"
        emoji="⭐"
        accentColor="#D97706"
      />

      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('learn')}
          style={[styles.tabBtn, mode === 'learn' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              mode === 'learn' && styles.tabBtnTextActive,
            ]}>
            ⭐ Flashcards
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
            🎯 Sight Word Quiz
          </Text>
        </Pressable>
      </View>

      {mode === 'learn' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Sight Word Card */}
          {currentSightWord && (
            <SightWordFlashcard
              sightWord={currentSightWord}
              onNext={handleNextWord}
            />
          )}

          {/* Quick Word Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wordsStrip}>
            {SIGHT_WORDS_DATA.map((item, idx) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Sight word ${item.word}`}
                onPress={() => setCurrentIdx(idx)}
                style={[
                  styles.stripPill,
                  idx === currentIdx && [
                    styles.stripPillActive,
                    {
                      borderColor: item.color,
                      backgroundColor: item.color + '15',
                    },
                  ],
                ]}>
                <Text
                  style={[
                    styles.stripWordText,
                    idx === currentIdx && {color: item.color},
                  ]}>
                  {item.word}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Quiz CTA */}
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode('quiz')}
            style={styles.quizCtaBtn}>
            <Text style={styles.quizCtaText}>🎯 Take Sight Word Quiz!</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <EnglishQuizEngine
          questions={quizQuestions}
          accentColor="#D97706"
          onFinish={handleFinishQuiz}
        />
      )}
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
    backgroundColor: '#D97706',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
  wordsStrip: {
    paddingVertical: 4,
    gap: 8,
  },
  stripPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  stripPillActive: {
    borderWidth: 2,
  },
  stripWordText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#374151',
  },
  quizCtaBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  quizCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
