import React, {useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {PHONICS_ITEMS} from '../../features/english/domain/catalog/englishData';
import {recordEnglishLessonResult} from '../../features/english/data/progress/englishProgress';
import {englishAudio} from '../../features/english/domain/audio/englishAudioEngine';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'Phonics'>;

export function EnglishPhonicsScreen() {
  const navigation = useNavigation<Nav>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [joined, setJoined] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const currentItem = PHONICS_ITEMS[currentIdx] ?? PHONICS_ITEMS[0];
  const isLast = currentIdx === PHONICS_ITEMS.length - 1;

  const handleJoinSounds = async () => {
    if (!currentItem) return;
    setJoined(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    englishAudio.playSuccessChime();
    await englishAudio.speak(
      `${currentItem.sounds.join('... ')}... ${currentItem.blendedWord}!`,
    );
  };

  const handlePlayIndividualPhoneme = (letter: string, sound: string) => {
    englishAudio.playTone(450, 120);
    englishAudio.speak(`${letter} says ${sound}`);
  };

  const handleNext = () => {
    if (isLast) {
      recordEnglishLessonResult('phonics', 'phonics_intro', 3, 100);
      navigation.navigate('LessonComplete', {
        subModuleId: 'phonics',
        title: 'Phonics Star',
        stars: 3,
        score: 100,
        totalQuestions: PHONICS_ITEMS.length,
        nextSubModuleId: 'sound_blending',
      });
    } else {
      setCurrentIdx(prev => prev + 1);
      setJoined(false);
    }
  };

  if (!currentItem) return null;

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Phonics & Phonemes"
        subtitle="Connect individual sounds into words!"
        emoji="🧩"
        accentColor="#06B6D4"
        titleColor="#06B6D4"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Progress Dots */}
        <View style={styles.progressRow}>
          {PHONICS_ITEMS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIdx && styles.dotActive,
                idx < currentIdx && styles.dotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Main Card */}
        <Animated.View
          style={[styles.mainCard, {transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.instruction}>
            {joined ? '🎉 Sounds Joined!' : 'Tap each sound, then Join!'}
          </Text>

          {/* Sound Blocks */}
          <View style={styles.blocksRow}>
            {currentItem.letters.map((letter, idx) => (
              <Pressable
                key={idx}
                accessibilityRole="button"
                accessibilityLabel={`Phoneme ${letter}`}
                onPress={() =>
                  handlePlayIndividualPhoneme(letter, currentItem.sounds[idx])
                }
                style={[styles.block, joined && styles.blockJoined]}>
                <Text style={styles.blockLetter}>{letter}</Text>
                <Text style={styles.blockSound}>{currentItem.sounds[idx]}</Text>
              </Pressable>
            ))}
          </View>

          {/* Explanation */}
          <Text style={styles.explanationText}>
            {joined
              ? currentItem.explanation
              : 'Hear: sound 1 + sound 2 + sound 3'}
          </Text>

          {/* Reveal info */}
          {joined ? (
            <View style={styles.revealedBox}>
              <Text style={styles.revealedEmoji}>{currentItem.emoji}</Text>
              <Text style={styles.revealedWord}>{currentItem.blendedWord}</Text>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={handleJoinSounds}
              style={styles.joinBtn}>
              <Text style={styles.joinBtnText}>🧩 Join Sounds Together!</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Next Step */}
        {joined && (
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {isLast ? 'Complete Phonics ⭐' : 'Next Phonics Word ➔'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 16,
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
    backgroundColor: '#06B6D4',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#06B6D4',
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  blocksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  block: {
    width: 80,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#ECFEFF',
    borderWidth: 2.5,
    borderColor: '#67E8F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  blockJoined: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  blockLetter: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0E7490',
  },
  blockSound: {
    fontSize: 14,
    fontWeight: '700',
    color: '#155E75',
  },
  explanationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  revealedBox: {
    alignItems: 'center',
    gap: 6,
  },
  revealedEmoji: {
    fontSize: 56,
  },
  revealedWord: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0891B2',
    letterSpacing: 2,
  },
  joinBtn: {
    backgroundColor: '#06B6D4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  nextBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
