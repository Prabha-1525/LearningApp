import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {ScienceHeader} from '../../features/science/presentation/components';
import {
  CELESTIAL_BODIES,
  type CelestialBody,
} from '../../features/science/domain/catalog/scienceData';
import {recordTopicCompletion} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'SpaceLesson'>;

export function SpaceLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [selectedBody, setSelectedBody] = useState<CelestialBody>(
    CELESTIAL_BODIES[0],
  );
  const [isDay, setIsDay] = useState(true);

  const starTwinkle = useSharedValue(1);

  React.useEffect(() => {
    starTwinkle.value = withRepeat(
      withSequence(
        withTiming(1.3, {duration: 600}),
        withTiming(0.8, {duration: 600}),
      ),
      -1,
      true,
    );
  }, [starTwinkle]);

  const animatedStarStyle = useAnimatedStyle(() => ({
    transform: [{scale: starTwinkle.value}],
  }));

  const handleFinish = () => {
    recordTopicCompletion('space', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'space',
      stars: 3,
      title: t('science.topics.space.title', 'Space & Sun/Moon'),
      nextTopicId: 'weather',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#0F172A">
      <ScienceHeader
        title={t('science.topics.space.title', 'Space')}
        emoji="🚀"
        accentColor="#818CF8"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Day & Night Interactive Toggle */}
        <View style={styles.dayNightCard}>
          <Text style={styles.dnTitle}>
            🌍 {t('science.space.dayNightTitle', 'Day and Night on Earth')}
          </Text>
          <View
            style={[
              styles.skyBox,
              {backgroundColor: isDay ? '#38BDF8' : '#0B0F19'},
            ]}>
            <Animated.View style={[styles.skyCenter, animatedStarStyle]}>
              <Text style={styles.skyCenterEmoji}>{isDay ? '☀️' : '🌙'}</Text>
            </Animated.View>
            <Text style={styles.skyStatusText}>
              {isDay
                ? '☀️ ' +
                  t(
                    'science.space.dayTime',
                    'Daytime: The Sun gives us light & warmth!',
                  )
                : '🌙 ' +
                  t(
                    'science.space.nightTime',
                    'Nighttime: Earth turns away from the Sun!',
                  )}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setIsDay(!isDay)}
            style={styles.toggleBtn}>
            <Text style={styles.toggleBtnText}>
              🔄 {isDay ? 'Switch to Night 🌙' : 'Switch to Day ☀️'}
            </Text>
          </Pressable>
        </View>

        {/* Featured Celestial Body */}
        <View style={[styles.featuredCard, {borderColor: selectedBody.color}]}>
          <View
            style={[
              styles.planetIconCircle,
              {backgroundColor: `${selectedBody.color}30`},
            ]}>
            <Text style={styles.planetIconEmoji}>{selectedBody.emoji}</Text>
          </View>
          <Text style={[styles.planetName, {color: selectedBody.color}]}>
            {t(selectedBody.nameKey, selectedBody.id)}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{t(selectedBody.typeKey, '')}</Text>
          </View>
          <Text style={styles.factText}>✨ {t(selectedBody.factKey, '')}</Text>
        </View>

        {/* Space Objects Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🌌 {t('science.space.solarSystemTitle', 'Solar System Explorer')}
          </Text>
        </View>

        <View style={styles.spaceGrid}>
          {CELESTIAL_BODIES.map(body => {
            const isSelected = body.id === selectedBody.id;
            return (
              <Pressable
                key={body.id}
                accessibilityRole="button"
                onPress={() => setSelectedBody(body)}
                style={[
                  styles.spaceBtn,
                  isSelected && [
                    styles.activeSpaceBtn,
                    {borderColor: body.color},
                  ],
                ]}>
                <Text style={styles.spaceBtnEmoji}>{body.emoji}</Text>
                <Text
                  style={[
                    styles.spaceBtnName,
                    isSelected && {color: body.color, fontWeight: '900'},
                  ]}>
                  {t(body.nameKey, body.id)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Complete Lesson Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Space Lesson')} ⭐⭐⭐
          </Text>
        </Pressable>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    gap: 16,
  },
  dayNightCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#334155',
    gap: 10,
  },
  dnTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  skyBox: {
    height: 140,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  skyCenter: {
    alignItems: 'center',
  },
  skyCenterEmoji: {
    fontSize: 48,
  },
  skyStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  toggleBtn: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  toggleBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  featuredCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    gap: 8,
  },
  planetIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetIconEmoji: {
    fontSize: 44,
  },
  planetName: {
    fontSize: 24,
    fontWeight: '900',
  },
  typeBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  factText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#94A3B8',
  },
  spaceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  spaceBtn: {
    width: '22%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  activeSpaceBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 2,
    transform: [{scale: 1.05}],
  },
  spaceBtnEmoji: {
    fontSize: 26,
  },
  spaceBtnName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  finishBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
