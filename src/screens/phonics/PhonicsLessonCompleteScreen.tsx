import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {phonicsAudio} from '../../features/phonics/domain/audio/phonicsAudioEngine';
import type {PhonicsStackParamList} from '../../navigation/phonicsTypes';

type Nav = NativeStackNavigationProp<
  PhonicsStackParamList,
  'PhonicsLessonComplete'
>;
type Route = RouteProp<PhonicsStackParamList, 'PhonicsLessonComplete'>;

export function PhonicsLessonCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {title, starsEarned, scorePercent, unlockedNextId, subModuleId} =
    route.params;

  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    phonicsAudio.playSuccessFanfare();
    phonicsAudio.speak(
      `Congratulations! You completed ${title} with ${starsEarned} stars!`,
    );

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, starsEarned, title]);

  const handlePlayAgain = () => {
    switch (subModuleId) {
      case 'letter_sounds':
        navigation.replace('LetterSounds');
        break;
      case 'sound_recognition':
        navigation.replace('SoundRecognition');
        break;
      case 'letter_matching':
        navigation.replace('LetterMatching');
        break;
      case 'beginning_sounds':
        navigation.replace('BeginningSounds');
        break;
      case 'ending_sounds':
        navigation.replace('EndingSounds');
        break;
      case 'slow_blending':
        navigation.replace('SlowBlending');
        break;
      case 'cvc_words':
        navigation.replace('CVCWords');
        break;
      case 'word_builder':
        navigation.replace('WordBuilder');
        break;
      case 'word_families':
        navigation.replace('WordFamilies');
        break;
      case 'word_transform':
        navigation.replace('WordTransform');
        break;
      case 'hear_choose_word':
        navigation.replace('HearChooseWord');
        break;
      case 'picture_to_word':
        navigation.replace('PictureToWord');
        break;
      case 'read_words':
        navigation.replace('ReadWords');
        break;
      case 'read_sentences':
        navigation.replace('ReadSentences');
        break;
      case 'phonics_games':
        navigation.replace('PhonicsGames');
        break;
      case 'phonics_challenge':
        navigation.replace('PhonicsChallenge');
        break;
      default:
        navigation.replace('PhonicsHome');
        break;
    }
  };

  const handleGoHome = () => {
    navigation.navigate('PhonicsHome');
  };

  return (
    <AppSafeAreaView>
      <View style={styles.container}>
        <Animated.View style={[styles.card, {transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.emojiBanner}>🎉 🔤 ⭐</Text>
          <Text style={styles.title}>Lesson Complete!</Text>
          <Text style={styles.subTitle}>{title}</Text>

          {/* Stars Row */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map(s => (
              <Text
                key={s}
                style={[styles.star, s > starsEarned && styles.starDim]}>
                ⭐
              </Text>
            ))}
          </View>

          {/* Score Pill */}
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>Score: {scorePercent}%</Text>
          </View>

          {/* Unlocked Next Notification */}
          {unlockedNextId && (
            <View style={styles.unlockBox}>
              <Text style={styles.unlockText}>🔓 Next Lesson Unlocked!</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsCol}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Play again"
              onPress={handlePlayAgain}
              style={styles.againBtn}>
              <Text style={styles.againBtnText}>Play Again 🔄</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Phonics Map"
              onPress={handleGoHome}
              style={styles.homeBtn}>
              <Text style={styles.homeBtnText}>Back to Phonics Map 🏠</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#3B82F6',
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  emojiBanner: {
    fontSize: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  star: {
    fontSize: 38,
  },
  starDim: {
    opacity: 0.25,
  },
  scorePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  unlockBox: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  unlockText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#047857',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  againBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  againBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  homeBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
});
