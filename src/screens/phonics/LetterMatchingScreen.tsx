import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {PhonicsHeader} from '../../features/phonics/presentation/components';
import {PHONICS_LETTERS} from '../../features/phonics/domain/catalog/phonicsData';
import {phonicsAudio} from '../../features/phonics/domain/audio/phonicsAudioEngine';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'LetterMatching'>;

const MATCH_PAIRS = [
  {upper: 'A', lower: 'a', sound: '/æ/', emoji: '🍎'},
  {upper: 'B', lower: 'b', sound: '/b/', emoji: '⚽'},
  {upper: 'C', lower: 'c', sound: '/k/', emoji: '🐱'},
  {upper: 'D', lower: 'd', sound: '/d/', emoji: '🐶'},
  {upper: 'S', lower: 's', sound: '/s/', emoji: '☀️'},
];

export function LetterMatchingScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);

  const handleUpperSelect = (upper: string) => {
    setSelectedUpper(upper);
    const item = PHONICS_LETTERS.find(l => l.letter === upper);
    if (item) {
      phonicsAudio.speakLetterPhoneme(item.letter, item.soundPronunciation);
    }
  };

  const handleLowerSelect = (lower: string) => {
    if (!selectedUpper) {
      phonicsAudio.speak('Select a big letter first!');
      return;
    }

    const pair = MATCH_PAIRS.find(p => p.upper === selectedUpper);
    if (pair && pair.lower === lower) {
      // Match!
      phonicsAudio.playTone(600, 80);
      phonicsAudio.speak(
        `Match! ${pair.upper} and ${pair.lower} say ${pair.sound}!`,
      );
      const updated = [...matchedLetters, selectedUpper];
      setMatchedLetters(updated);
      setSelectedUpper(null);

      if (updated.length === MATCH_PAIRS.length) {
        // Finished
        setTimeout(() => {
          const res = recordPhonicsLessonResult('letter_matching', 100, 3);
          navigation.replace('PhonicsLessonComplete', {
            subModuleId: 'letter_matching',
            title: 'Matching Star',
            starsEarned: 3,
            scorePercent: 100,
            unlockedNextId: res.unlockedNextId,
          });
        }, 1000);
      }
    } else {
      phonicsAudio.playTryAgain();
      phonicsAudio.speak('Try another small letter!');
    }
  };

  return (
    <AppSafeAreaView>
      <PhonicsHeader
        title="Letter Matching"
        subtitle="Match the big letter with its small letter partner!"
        accentColor="#8B5CF6"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Big Letters</Text>
          <View style={styles.row}>
            {MATCH_PAIRS.map(pair => {
              const isMatched = matchedLetters.includes(pair.upper);
              const isSelected = selectedUpper === pair.upper;

              return (
                <Pressable
                  key={pair.upper}
                  accessibilityRole="button"
                  accessibilityLabel={`Upper letter ${pair.upper}`}
                  disabled={isMatched}
                  onPress={() => handleUpperSelect(pair.upper)}
                  style={[
                    styles.tile,
                    isSelected && styles.tileSelected,
                    isMatched && styles.tileMatched,
                  ]}>
                  <Text
                    style={[styles.tileChar, isMatched && styles.textMatched]}>
                    {pair.upper}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>2. Small Letters</Text>
          <View style={styles.row}>
            {MATCH_PAIRS.map(pair => {
              const isMatched = matchedLetters.includes(pair.upper);

              return (
                <Pressable
                  key={pair.lower}
                  accessibilityRole="button"
                  accessibilityLabel={`Lower letter ${pair.lower}`}
                  disabled={isMatched}
                  onPress={() => handleLowerSelect(pair.lower)}
                  style={[styles.tile, isMatched && styles.tileMatched]}>
                  <Text
                    style={[styles.tileChar, isMatched && styles.textMatched]}>
                    {pair.lower}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.hintBox}>
            <Text style={styles.hintText}>
              Matched: {matchedLetters.length} / {MATCH_PAIRS.length}
            </Text>
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
    borderWidth: 3,
    borderColor: '#8B5CF6',
    padding: 20,
    gap: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#6D28D9',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tile: {
    width: 60,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
  },
  tileMatched: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  tileChar: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1F2937',
  },
  textMatched: {
    color: '#065F46',
  },
  hintBox: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 6,
  },
  hintText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B21B6',
  },
});
