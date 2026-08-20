import React, {useEffect} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {englishAudio} from '../../features/english/domain/audio/englishAudioEngine';
import type {EnglishStackParamList} from '../../navigation/englishTypes';

type Nav = NativeStackNavigationProp<EnglishStackParamList, 'LessonComplete'>;
type Route = RouteProp<EnglishStackParamList, 'LessonComplete'>;

export function EnglishLessonCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {title, stars, score, totalQuestions, nextSubModuleId} = route.params;

  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const starsAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    englishAudio.playCelebrationFanfare();
    englishAudio.speak(`Awesome reading! You earned ${stars} stars!`);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(starsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, starsAnim, stars]);

  const handleNext = () => {
    if (nextSubModuleId) {
      switch (nextSubModuleId) {
        case 'capital_small':
          navigation.replace('CapitalSmall');
          break;
        case 'letter_sounds':
          navigation.replace('LetterSounds');
          break;
        case 'letter_objects':
          navigation.replace('LetterObjects');
          break;
        case 'phonics':
          navigation.replace('Phonics');
          break;
        case 'sound_blending':
          navigation.replace('SoundBlending');
          break;
        case 'word_building':
          navigation.replace('WordBuilding');
          break;
        case 'cvc_words':
          navigation.replace('CVCWords');
          break;
        case 'sight_words':
          navigation.replace('SightWords');
          break;
        case 'tongue_twisters':
          navigation.replace('TongueTwisters');
          break;
        case 'sentence_reading':
          navigation.replace('SentenceReading');
          break;
        case 'short_stories':
          navigation.replace('ShortStories');
          break;
        case 'reading_challenge':
          navigation.replace('ReadingChallenge');
          break;
        default:
          navigation.replace('Home');
          break;
      }
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <AppSafeAreaView>
      <View style={styles.container}>
        <Animated.View
          style={[styles.celebrationCard, {transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.trophyEmoji}>🎉</Text>
          <Text style={styles.title}>{title}</Text>

          {/* Stars display */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map(s => (
              <Text key={s} style={styles.starText}>
                {s <= stars ? '⭐' : '☆'}
              </Text>
            ))}
          </View>

          <Text style={styles.scoreText}>
            Score: {score} / {totalQuestions}
          </Text>

          <Text style={styles.praiseText}>
            {stars === 3
              ? '🌟 Super Reader! Perfect Score!'
              : stars === 2
              ? '👏 Great Reading! You are doing awesome!'
              : '💪 Good Effort! Keep practicing!'}
          </Text>

          <View style={styles.badgeHintBox}>
            <Text style={styles.badgeHintText}>
              🏅 New Reading Badges & Stars Unlocked!
            </Text>
          </View>

          {/* Action Buttons */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue to next lesson"
            onPress={handleNext}
            style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              {nextSubModuleId ? 'Next Lesson ➔' : 'Back to English Hub 🏠'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to English hub"
            onPress={() => navigation.navigate('Home')}
            style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>View Reading Journey</Text>
          </Pressable>
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
  celebrationCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#3B82F6',
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trophyEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  starText: {
    fontSize: 36,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  praiseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
  },
  badgeHintBox: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeHintText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  secondaryBtnText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
});
