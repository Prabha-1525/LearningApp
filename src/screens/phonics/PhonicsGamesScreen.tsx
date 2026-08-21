import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {phonicsAudio} from '../../features/phonics/domain/audio/phonicsAudioEngine';
import {recordPhonicsLessonResult} from '../../features/phonics/data/progress/phonicsProgress';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<PhonicsStackParamList, 'PhonicsGames'>;

const BALLOON_GAME = [
  {
    targetSound: '/s/',
    spokenPrompt: 'Pop the balloon with the letter that makes /s/!',
    correctLetter: 'S',
    balloons: [
      {letter: 'B', color: '#EF4444'},
      {letter: 'S', color: '#3B82F6'},
      {letter: 'M', color: '#10B981'},
    ],
  },
  {
    targetSound: '/m/',
    spokenPrompt: 'Pop the balloon with the letter that makes /m/!',
    correctLetter: 'M',
    balloons: [
      {letter: 'M', color: '#F59E0B'},
      {letter: 'D', color: '#8B5CF6'},
      {letter: 'T', color: '#EC4899'},
    ],
  },
  {
    targetSound: '/b/',
    spokenPrompt: 'Pop the balloon with the letter that makes /b/!',
    correctLetter: 'B',
    balloons: [
      {letter: 'P', color: '#06B6D4'},
      {letter: 'N', color: '#84CC16'},
      {letter: 'B', color: '#EAB308'},
    ],
  },
];

export function PhonicsGamesScreen() {
  const navigation = useNavigation<Nav>();
  const [roundIdx, setRoundIdx] = useState(0);
  const [poppedLetter, setPoppedLetter] = useState<string | null>(null);

  const currentRound = BALLOON_GAME[roundIdx] ?? BALLOON_GAME[0]!;

  const handlePop = (letter: string) => {
    setPoppedLetter(letter);

    if (letter === currentRound.correctLetter) {
      phonicsAudio.playTone(700, 100);
      phonicsAudio.speak(`Pop! ${letter} makes ${currentRound.targetSound}!`);

      setTimeout(() => {
        if (roundIdx < BALLOON_GAME.length - 1) {
          setRoundIdx(prev => prev + 1);
          setPoppedLetter(null);
        } else {
          const res = recordPhonicsLessonResult('phonics_games', 100, 3);
          navigation.replace('PhonicsLessonComplete', {
            subModuleId: 'phonics_games',
            title: 'Phonics Gamer',
            starsEarned: 3,
            scorePercent: 100,
            unlockedNextId: res.unlockedNextId,
          });
        }
      }, 1000);
    } else {
      phonicsAudio.playTryAgain();
      phonicsAudio.speak('Try popping another balloon!');
    }
  };

  return (
    <AppSafeAreaView>
      <LearningHeader
        title="Pop the Sound!"
        subtitle={currentRound.spokenPrompt}
        accentColor="#F43F5E"
        titleColor="#F43F5E"
        audioPromptText={currentRound.spokenPrompt}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.tag}>🎈 BALLOON POP GAME</Text>
          <Text style={styles.soundTarget}>
            Target Sound:{' '}
            <Text style={styles.targetAccent}>{currentRound.targetSound}</Text>
          </Text>

          {/* Balloon Row */}
          <View style={styles.balloonsContainer}>
            {currentRound.balloons.map(b => {
              const isPopped =
                poppedLetter === b.letter &&
                b.letter === currentRound.correctLetter;

              return (
                <Pressable
                  key={b.letter}
                  accessibilityRole="button"
                  accessibilityLabel={`Balloon ${b.letter}`}
                  onPress={() => handlePop(b.letter)}
                  style={[
                    styles.balloon,
                    {backgroundColor: b.color},
                    isPopped && styles.balloonPopped,
                  ]}>
                  <Text style={styles.balloonChar}>
                    {isPopped ? '💥' : b.letter}
                  </Text>
                  <View style={styles.string} />
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.footerText}>
            Round {roundIdx + 1} of {BALLOON_GAME.length}
          </Text>
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
    borderColor: '#F43F5E',
    padding: 22,
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
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  soundTarget: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  targetAccent: {
    color: '#E11D48',
    fontSize: 22,
  },
  balloonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 20,
    justifyContent: 'center',
  },
  balloon: {
    width: 86,
    height: 106,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  balloonPopped: {
    transform: [{scale: 1.2}],
  },
  balloonChar: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  string: {
    position: 'absolute',
    bottom: -16,
    width: 2,
    height: 16,
    backgroundColor: '#9CA3AF',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
});
