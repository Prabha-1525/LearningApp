import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  EnglishHeader,
  EnglishQuizEngine,
  LetterCard,
} from '../../features/english/presentation/components';
import {
  ALPHABET_LETTERS,
  SUBMODULE_QUIZZES,
} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'Alphabet'>;

export function EnglishAlphabetScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentLetter = ALPHABET_LETTERS[selectedIdx] ?? ALPHABET_LETTERS[0];
  const quizQuestions = SUBMODULE_QUIZZES.alphabet ?? [];

  const handleFinishQuiz = (score: number, stars: number) => {
    recordEnglishLessonResult('alphabet', 'alphabet_intro', stars, score);
    navigation.navigate('LessonComplete', {
      subModuleId: 'alphabet',
      title: 'Alphabet Master',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'capital_small',
    });
  };

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="Alphabet A–Z"
        subtitle="Tap any letter to hear its sound!"
        emoji="🔤"
        accentColor="#3B82F6"
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
            📖 Learn Letters
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
            🎯 Mini Quiz
          </Text>
        </Pressable>
      </View>

      {mode === 'learn' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Horizontal Letter Picker Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.letterStrip}>
            {ALPHABET_LETTERS.map((item, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select letter ${item.upper}`}
                  onPress={() => setSelectedIdx(idx)}
                  style={[
                    styles.stripLetterBtn,
                    isSelected && [
                      styles.stripLetterBtnSelected,
                      {
                        borderColor: item.color,
                        backgroundColor: item.color + '15',
                      },
                    ],
                  ]}>
                  <Text
                    style={[
                      styles.stripLetterUpper,
                      isSelected && {color: item.color},
                    ]}>
                    {item.upper}
                  </Text>
                  <Text
                    style={[
                      styles.stripLetterLower,
                      isSelected && {color: item.color},
                    ]}>
                    {item.lower}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Interactive Letter Hero Card */}
          <LetterCard letter={currentLetter} />

          {/* Navigation between letters */}
          <View style={styles.navRow}>
            <Pressable
              accessibilityRole="button"
              disabled={selectedIdx === 0}
              onPress={() => setSelectedIdx(prev => Math.max(0, prev - 1))}
              style={[
                styles.navBtn,
                selectedIdx === 0 && styles.navBtnDisabled,
              ]}>
              <Text style={styles.navBtnText}>‹ Previous</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={selectedIdx === ALPHABET_LETTERS.length - 1}
              onPress={() =>
                setSelectedIdx(prev =>
                  Math.min(ALPHABET_LETTERS.length - 1, prev + 1),
                )
              }
              style={[
                styles.navBtn,
                selectedIdx === ALPHABET_LETTERS.length - 1 &&
                  styles.navBtnDisabled,
              ]}>
              <Text style={styles.navBtnText}>Next Letter ›</Text>
            </Pressable>
          </View>

          {/* Take Quiz CTA */}
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode('quiz')}
            style={styles.quizCtaBtn}>
            <Text style={styles.quizCtaText}>
              🎯 Try Alphabet Quiz & Earn Stars!
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        <EnglishQuizEngine
          questions={quizQuestions}
          accentColor="#3B82F6"
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
    backgroundColor: '#3B82F6',
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
  letterStrip: {
    paddingVertical: 4,
    gap: 8,
  },
  stripLetterBtn: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stripLetterBtnSelected: {
    borderWidth: 2.5,
  },
  stripLetterUpper: {
    fontSize: 18,
    fontWeight: '900',
    color: '#374151',
  },
  stripLetterLower: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  quizCtaBtn: {
    backgroundColor: '#10B981',
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
