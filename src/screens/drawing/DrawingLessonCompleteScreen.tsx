import React, {useEffect} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {drawingAudio} from '../../features/drawing/domain/audio/drawingAudioEngine';
import type {DrawingStackParamList} from '../../navigation/drawingTypes';

type Nav = NativeStackNavigationProp<DrawingStackParamList, 'LessonComplete'>;
type Route = RouteProp<DrawingStackParamList, 'LessonComplete'>;

export function DrawingLessonCompleteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {title, stars, score, totalQuestions, nextSubModuleId} = route.params;

  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const starsAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    drawingAudio.playCelebrationFanfare();
    drawingAudio.speak(`Awesome creativity! You earned ${stars} stars!`);

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
        case 'color_match':
          navigation.replace('ColorMatch');
          break;
        case 'color_mix':
          navigation.replace('ColorMix');
          break;
        case 'coloring':
          navigation.replace('Coloring');
          break;
        case 'trace':
          navigation.replace('Trace');
          break;
        case 'shapes':
          navigation.replace('Shapes');
          break;
        case 'draw_objects':
          navigation.replace('ObjectDrawing');
          break;
        case 'guided_drawing':
          navigation.replace('GuidedDrawing');
          break;
        case 'free_drawing':
          navigation.replace('FreeDrawing');
          break;
        case 'creative_challenge':
          navigation.replace('CreativeChallenge');
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
          <Text style={styles.trophyEmoji}>🎉 🎨</Text>
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
              ? '🌟 Master Artist! Perfect Creation!'
              : stars === 2
              ? '👏 Great Artistry! Wonderful colors!'
              : '💪 Good Effort! Keep creating!'}
          </Text>

          <View style={styles.badgeHintBox}>
            <Text style={styles.badgeHintText}>
              🏅 New Art Badges & Stars Unlocked!
            </Text>
          </View>

          {/* Action Buttons */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue to next lesson"
            onPress={handleNext}
            style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>
              {nextSubModuleId ? 'Next Lesson ➔' : 'Back to Art Hub 🏠'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to art hub"
            onPress={() => navigation.navigate('Home')}
            style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>View Creative Journey</Text>
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
    borderColor: '#EC4899',
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
    fontSize: 56,
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
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  badgeHintText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#BE185D',
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#EC4899',
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
