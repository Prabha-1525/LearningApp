import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {CVC_WORDS_CATALOG} from '../../features/phonics/domain/catalog/phonicsData';
import {phonicsAudio} from '../../features/phonics/domain/audio/phonicsAudioEngine';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'ReadWords'>;

export function ReadWordsScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [readWordsCount, setReadWordsCount] = useState(0);

  const words = CVC_WORDS_CATALOG.slice(0, 8);
  const currentItem = words[currentIdx] ?? words[0]!;

  const handleSpeak = () => {
    phonicsAudio.speak(currentItem.word);
  };

  const handleSoundOut = () => {
    phonicsAudio.speakSlowBlend(currentItem.sounds, currentItem.word);
  };

  const handleNext = () => {
    phonicsAudio.playTone(600, 60);
    const updatedCount = readWordsCount + 1;
    setReadWordsCount(updatedCount);

    if (currentIdx < words.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const res = recordPhonicsLessonResult('read_words', 100, 3);
      navigation.replace('PhonicsLessonComplete', {
        subModuleId: 'read_words',
        title: 'Word Reading Hero',
        starsEarned: 3,
        scorePercent: 100,
        unlockedNextId: res.unlockedNextId,
      });
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Read Simple Words"
        subtitle={`Word ${currentIdx + 1} of ${words.length}`}
        accentColor="#A855F7"
        titleColor="#A855F7"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.tag}>📖 DECODABLE READING</Text>

          {/* Picture Clue */}
          <View style={styles.clueBox}>
            <Text style={styles.emoji}>{currentItem.emoji}</Text>
          </View>

          {/* Large Word Display */}
          <View style={styles.wordBox}>
            <Text style={styles.wordText}>{currentItem.word}</Text>
          </View>

          {/* Individual Phoneme Symbols */}
          <View style={styles.phonemesRow}>
            {currentItem.soundSymbols.map((sym, idx) => (
              <View key={idx} style={styles.phonemePill}>
                <Text style={styles.phonemeText}>{sym}</Text>
              </View>
            ))}
          </View>

          {/* Controls */}
          <View style={styles.actionsCol}>
            <View style={styles.btnRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sound out word"
                onPress={handleSoundOut}
                style={styles.soundOutBtn}>
                <Text style={styles.soundOutText}>👆 Tap Sounds</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Hear full word"
                onPress={handleSpeak}
                style={styles.speakBtn}>
                <Text style={styles.speakText}>🔊 Hear Word</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="I read it"
              onPress={handleNext}
              style={styles.readBtn}>
              <Text style={styles.readBtnText}>I Read It! ⭐ Next ➔</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#A855F7',
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tag: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9333EA',
    letterSpacing: 0.5,
  },
  clueBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F3E8FF',
  },
  emoji: {
    fontSize: 50,
  },
  wordBox: {
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: '#A855F7',
    borderRadius: 22,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  wordText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 4,
  },
  phonemesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  phonemePill: {
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
  },
  phonemeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7E22CE',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  soundOutBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  soundOutText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  speakBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  speakText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  readBtn: {
    backgroundColor: '#A855F7',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
