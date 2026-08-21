import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {WeatherSceneView} from '../../features/science/presentation/components';
import {recordTopicCompletion} from '../../features/science/data/progress/scienceProgress';
import type {ScienceStackParamList} from '../../navigation/scienceTypes';

type Nav = NativeStackNavigationProp<ScienceStackParamList, 'WeatherLesson'>;

export function WeatherLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [weatherQuizPick, setWeatherQuizPick] = useState<string | null>(null);

  const handleFinish = () => {
    recordTopicCompletion('weather', 3);
    navigation.navigate('ScienceComplete', {
      topicId: 'weather',
      stars: 3,
      title: t('science.topics.weather.title', 'Weather'),
      nextTopicId: 'water',
    });
  };

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0F9FF">
      <LearningHeader
        title={t('science.topics.weather.title', 'Weather')}
        emoji="🌦️"
        accentColor="#0284C7"
        titleColor="#0284C7"
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Interactive Weather Simulator */}
        <WeatherSceneView />

        {/* Rain Gear Mini Game */}
        <View style={styles.gearBox}>
          <Text style={styles.gearTitle}>
            🌧️ {t('science.weather.gearTitle', 'It is raining outside!')}
          </Text>
          <Text style={styles.gearSubtitle}>
            {t(
              'science.weather.gearSubtitle',
              'What should you take with you?',
            )}
          </Text>

          <View style={styles.gearOptions}>
            {[
              {id: 'umbrella', emoji: '☂️', label: 'Umbrella', correct: true},
              {
                id: 'sunglasses',
                emoji: '🕶️',
                label: 'Sunglasses',
                correct: false,
              },
              {id: 'swimsuit', emoji: '🩳', label: 'Swimsuit', correct: false},
            ].map(item => {
              const isSelected = weatherQuizPick === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => setWeatherQuizPick(item.id)}
                  style={[
                    styles.gearBtn,
                    isSelected &&
                      (item.correct
                        ? styles.gearBtnCorrect
                        : styles.gearBtnWrong),
                  ]}>
                  <Text style={styles.gearEmoji}>{item.emoji}</Text>
                  <Text style={styles.gearLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {weatherQuizPick === 'umbrella' && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                🎉 Great choice! An umbrella keeps you dry in the rain! ☔
              </Text>
            </View>
          )}
        </View>

        {/* Complete Lesson Button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleFinish}
          style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>
            🏆 {t('science.finishLesson', 'Complete Weather Lesson')} ⭐⭐⭐
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
  gearBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    gap: 10,
  },
  gearTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0369A1',
    textAlign: 'center',
  },
  gearSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    textAlign: 'center',
  },
  gearOptions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 6,
  },
  gearBtn: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  gearBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  gearBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  gearEmoji: {
    fontSize: 32,
  },
  gearLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0C4A6E',
    marginTop: 4,
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  successText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
    textAlign: 'center',
  },
  finishBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
