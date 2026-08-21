import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {shapesAudio} from '../../features/shapes/domain/audio/shapesAudioEngine';
import type {ShapesStackParamList} from '../../navigation/shapesTypes';

type Nav = NativeStackNavigationProp<ShapesStackParamList, 'LessonComplete'>;
type Route = RouteProp<ShapesStackParamList, 'LessonComplete'>;

export function ShapeLessonCompleteScreen() {
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
    shapesAudio.playCelebrationFanfare();
    shapesAudio.speak(
      `Congratulations! You completed ${title}! You earned ${stars} stars!`,
    );
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, stars, title]);

  const handleGoHome = () => {
    shapesAudio.playTone(440, 60);
    navigation.navigate('ShapesHome');
  };

  const handleNextSubModule = () => {
    if (!nextSubModuleId) {
      handleGoHome();
      return;
    }

    switch (nextSubModuleId) {
      case 'learn_shapes':
        navigation.navigate('LearnShapes');
        break;
      case 'recognition':
        navigation.navigate('ShapeRecognition');
        break;
      case 'matching':
        navigation.navigate('ShapeMatching');
        break;
      case 'properties':
        navigation.navigate('ShapeProperties');
        break;
      case 'sorting':
        navigation.navigate('ShapeSorting');
        break;
      case 'compare':
        navigation.navigate('ShapeCompare');
        break;
      case 'around_us':
        navigation.navigate('ShapesAroundUs');
        break;
      case 'count':
        navigation.navigate('ShapeCount');
        break;
      case 'patterns':
        navigation.navigate('ShapePatterns');
        break;
      case 'puzzles':
        navigation.navigate('ShapePuzzles');
        break;
      case 'challenge':
        navigation.navigate('ShapeChallenge');
        break;
      default:
        handleGoHome();
    }
  };

  return (
    <AppSafeAreaView>
      <View style={styles.container}>
        <Animated.View style={[styles.card, {transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.celebrationEmoji}>🎉 🏆 🌟</Text>
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
                accessibilityLabel="Next lesson"
                onPress={handleNextSubModule}
                style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next Shape Adventure ➔</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Shapes Home"
              onPress={handleGoHome}
              style={styles.homeBtn}>
              <Text style={styles.homeBtnText}>Back to Shapes Home 🔷</Text>
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
  scoreBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E40AF',
  },
  actionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  nextBtn: {
    backgroundColor: '#3B82F6',
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
