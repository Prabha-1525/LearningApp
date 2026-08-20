import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  CVCWordExplorer,
  EnglishHeader,
  EnglishQuizEngine,
} from '../../features/english/presentation/components';
import {
  CVC_WORDS_DATA,
  SUBMODULE_QUIZZES,
} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'CVCWords'>;

export function EnglishCVCWordsScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedVowel, setSelectedVowel] = useState<
    'all' | 'a' | 'e' | 'i' | 'o' | 'u'
  >('all');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const filteredWords = React.useMemo(() => {
    if (selectedVowel === 'all') return CVC_WORDS_DATA;
    return CVC_WORDS_DATA.filter(w => w.vowel === selectedVowel);
  }, [selectedVowel]);

  const currentWord = filteredWords[currentWordIdx] ?? filteredWords[0];
  const quizQuestions = SUBMODULE_QUIZZES.cvc_words;

  const handleFinishQuiz = (score: number, stars: number) => {
    recordEnglishLessonResult('cvc_words', 'cvc_words_quiz', stars, score);
    navigation.navigate('LessonComplete', {
      subModuleId: 'cvc_words',
      title: 'CVC Master Reader',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'sight_words',
    });
  };

  const handleNextWord = () => {
    setCurrentWordIdx(prev => (prev + 1) % filteredWords.length);
  };

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="CVC Words Reading"
        subtitle="Read 3-letter consonant-vowel-consonant words!"
        emoji="📖"
        accentColor="#E11D48"
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
            📖 CVC Words
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
            🎯 CVC Quiz
          </Text>
        </Pressable>
      </View>

      {mode === 'learn' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Vowel Filter Pills */}
          <View style={styles.vowelFilterRow}>
            {(['all', 'a', 'e', 'i', 'o', 'u'] as const).map(v => (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityLabel={`Filter vowel ${v}`}
                onPress={() => {
                  setSelectedVowel(v);
                  setCurrentWordIdx(0);
                }}
                style={[
                  styles.vowelPill,
                  selectedVowel === v && styles.vowelPillActive,
                ]}>
                <Text
                  style={[
                    styles.vowelText,
                    selectedVowel === v && styles.vowelTextActive,
                  ]}>
                  {v === 'all' ? 'All' : `-${v.toUpperCase()}-`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* CVC Word Card */}
          {currentWord && (
            <CVCWordExplorer wordItem={currentWord} onNext={handleNextWord} />
          )}

          {/* Quiz CTA */}
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode('quiz')}
            style={styles.quizCtaBtn}>
            <Text style={styles.quizCtaText}>
              🎯 Take CVC Quiz & Earn Stars!
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        <EnglishQuizEngine
          questions={quizQuestions}
          accentColor="#E11D48"
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
    backgroundColor: '#E11D48',
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
    gap: 14,
  },
  vowelFilterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  vowelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  vowelPillActive: {
    backgroundColor: '#FFE4E6',
    borderColor: '#F43F5E',
  },
  vowelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  vowelTextActive: {
    color: '#E11D48',
  },
  quizCtaBtn: {
    backgroundColor: '#E11D48',
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
