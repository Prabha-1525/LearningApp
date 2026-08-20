import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  EnglishHeader,
  EnglishQuizEngine,
} from '../../features/english/presentation/components';
import {
  BEGINNING_SOUNDS_DATA,
  LETTER_SOUNDS_DATA,
  SUBMODULE_QUIZZES,
} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import {englishAudio} from '../../features/english/domain/audio/englishAudioEngine';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'LetterSounds'>;

export function EnglishSoundsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'sounds' | 'beginning' | 'quiz'>('sounds');

  const quizQuestions = [
    ...(SUBMODULE_QUIZZES.letter_sounds ?? []),
    ...(SUBMODULE_QUIZZES.beginning_sounds ?? []),
  ];

  const handlePlaySound = (item: (typeof LETTER_SOUNDS_DATA)[number]) => {
    englishAudio.playTone(480, 100);
    englishAudio.speak(item.audioText);
  };

  const handlePlayBeginningSound = (
    item: (typeof BEGINNING_SOUNDS_DATA)[number],
  ) => {
    englishAudio.playTone(520, 100);
    englishAudio.speak(`${item.word}. The first sound is ${item.soundHint}.`);
  };

  const handleFinishQuiz = (score: number, stars: number) => {
    recordEnglishLessonResult(
      'letter_sounds',
      'letter_sounds_quiz',
      stars,
      score,
    );
    recordEnglishLessonResult(
      'beginning_sounds',
      'beginning_sounds_quiz',
      stars,
      score,
    );
    navigation.navigate('LessonComplete', {
      subModuleId: 'letter_sounds',
      title: 'Sound Explorer & Detective',
      stars,
      score,
      totalQuestions: quizQuestions.length,
      nextSubModuleId: 'letter_objects',
    });
  };

  return (
    <AppSafeAreaView>
      <EnglishHeader
        title="Letter & Beginning Sounds"
        subtitle="Learn phonetic sounds and first sounds!"
        emoji="🔊"
        accentColor="#EC4899"
      />

      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setTab('sounds')}
          style={[styles.tabBtn, tab === 'sounds' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              tab === 'sounds' && styles.tabBtnTextActive,
            ]}>
            🔊 Letter Sounds
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setTab('beginning')}
          style={[styles.tabBtn, tab === 'beginning' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              tab === 'beginning' && styles.tabBtnTextActive,
            ]}>
            👂 1st Sounds
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setTab('quiz')}
          style={[styles.tabBtn, tab === 'quiz' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              tab === 'quiz' && styles.tabBtnTextActive,
            ]}>
            🎯 Quiz
          </Text>
        </Pressable>
      </View>

      {tab === 'sounds' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>
            Tap any card to hear the phonetic sound:
          </Text>

          <View style={styles.cardsGrid}>
            {LETTER_SOUNDS_DATA.map(item => (
              <Pressable
                key={item.letter}
                accessibilityRole="button"
                accessibilityLabel={`Sound for letter ${item.letter}`}
                onPress={() => handlePlaySound(item)}
                style={styles.soundCard}>
                <Text style={styles.cardLetter}>{item.letter}</Text>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardSound}>{item.soundHint}</Text>
                <Text style={styles.cardWord}>{item.exampleWord}</Text>
                <View style={styles.speakerIconBox}>
                  <Text style={styles.speakerIcon}>🔊</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setTab('quiz')}
            style={styles.quizCtaBtn}>
            <Text style={styles.quizCtaText}>
              🎯 Try Sound Quiz & Earn Stars!
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {tab === 'beginning' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>
            What sound does each word start with? Tap to listen:
          </Text>

          <View style={styles.cardsGrid}>
            {BEGINNING_SOUNDS_DATA.map(item => (
              <Pressable
                key={item.word}
                accessibilityRole="button"
                accessibilityLabel={`First sound of ${item.word}`}
                onPress={() => handlePlayBeginningSound(item)}
                style={styles.beginningCard}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.beginningWord}>{item.word}</Text>
                <View style={styles.firstSoundPill}>
                  <Text style={styles.firstSoundText}>
                    Starts with: {item.soundHint} ({item.firstLetter})
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setTab('quiz')}
            style={styles.quizCtaBtn}>
            <Text style={styles.quizCtaText}>
              🎯 Practice Beginning Sounds!
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {tab === 'quiz' && (
        <EnglishQuizEngine
          questions={quizQuestions}
          accentColor="#EC4899"
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
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#EC4899',
  },
  tabBtnText: {
    fontSize: 13,
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
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4B5563',
    textAlign: 'center',
    marginVertical: 4,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  soundCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FBCFE8',
    padding: 16,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLetter: {
    fontSize: 36,
    fontWeight: '900',
    color: '#BE185D',
  },
  cardEmoji: {
    fontSize: 40,
  },
  cardSound: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
  },
  cardWord: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  speakerIconBox: {
    marginTop: 4,
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  speakerIcon: {
    fontSize: 14,
  },
  beginningCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FDE68A',
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  beginningWord: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  firstSoundPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  firstSoundText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    textAlign: 'center',
  },
  quizCtaBtn: {
    backgroundColor: '#EC4899',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  quizCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
