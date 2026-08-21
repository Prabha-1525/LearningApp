import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {animalsAudio} from '../../features/animals/domain/audio/animalsAudioEngine';
import type {AnimalsStackParamList} from '../../navigation/animalsTypes';

type Nav = NativeStackNavigationProp<AnimalsStackParamList, 'LessonComplete'>;
type Route = RouteProp<AnimalsStackParamList, 'LessonComplete'>;

export function AnimalLessonCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {
    title,
    stars = 3,
    score = 3,
    totalQuestions = 3,
    nextSubModuleId,
  } = route.params;

  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    animalsAudio.playCelebrationFanfare();
    animalsAudio.speak(
      `Congratulations! You completed ${title}! You earned ${stars} stars!`,
    );
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, stars, title]);

  const handleGoHome = () => {
    animalsAudio.playTone(440, 60);
    navigation.navigate('AnimalsHome');
  };

  const handleNextSubModule = () => {
    if (!nextSubModuleId) {
      handleGoHome();
      return;
    }

    switch (nextSubModuleId) {
      case 'meet_animals':
        navigation.navigate('MeetAnimals');
        break;
      case 'land_animals':
        navigation.navigate('LandAnimals');
        break;
      case 'animal_sounds':
        navigation.navigate('AnimalSounds');
        break;
      case 'habitats':
        navigation.navigate('AnimalHabitats');
        break;
      case 'animal_diets':
        navigation.navigate('AnimalDiets');
        break;
      case 'birds':
        navigation.navigate('Birds');
        break;
      case 'sea_animals':
        navigation.navigate('SeaAnimals');
        break;
      case 'amphibians_reptiles':
        navigation.navigate('AmphibiansReptiles');
        break;
      case 'insects':
        navigation.navigate('Insects');
        break;
      case 'animal_babies':
        navigation.navigate('AnimalBabies');
        break;
      case 'matching':
        navigation.navigate('AnimalMatching');
        break;
      case 'classification':
        navigation.navigate('AnimalClassification');
        break;
      case 'count':
        navigation.navigate('AnimalCount');
        break;
      case 'patterns':
        navigation.navigate('AnimalPatterns');
        break;
      case 'puzzles':
        navigation.navigate('AnimalPuzzles');
        break;
      case 'challenge':
        navigation.navigate('AnimalChallenge');
        break;
      default:
        handleGoHome();
    }
  };

  return (
    <AppSafeAreaView>
      <View style={styles.container}>
        <Animated.View style={[styles.card, {transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.celebrationEmoji}>🎉 🐾 🏆</Text>
          <Text style={styles.title}>Lesson Complete!</Text>
          <Text style={styles.subTitle}>{title}</Text>

          {/* Stars Row */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map(sIdx => (
              <Text
                key={sIdx}
                style={[styles.star, {opacity: sIdx <= stars ? 1 : 0.25}]}>
                ⭐
              </Text>
            ))}
          </View>

          {/* Score Badge */}
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              Score: {score} / {totalQuestions}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsCol}>
            {nextSubModuleId && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next animal adventure"
                onPress={handleNextSubModule}
                style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next Animal Adventure ➔</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Animals Home"
              onPress={handleGoHome}
              style={styles.homeBtn}>
              <Text style={styles.homeBtnText}>Back to Animals Home 🐾</Text>
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
    borderColor: '#F59E0B',
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  celebrationEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
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
  scoreBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#B45309',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  nextBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  homeBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
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
