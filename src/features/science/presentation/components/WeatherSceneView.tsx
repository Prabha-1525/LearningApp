import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import {
  WEATHER_TYPES,
  type WeatherType,
} from '../../domain/catalog/scienceData';

type WeatherSceneViewProps = {
  readonly onWeatherChange?: (weather: WeatherType) => void;
};

export function WeatherSceneView({onWeatherChange}: WeatherSceneViewProps) {
  const {t} = useTranslation();
  const [currentWeather, setCurrentWeather] = useState<WeatherType>(
    WEATHER_TYPES[0],
  );

  const scale = useSharedValue(1);

  const handleSelectWeather = (weather: WeatherType) => {
    scale.value = withSequence(
      withSpring(1.2, {damping: 4, stiffness: 200}),
      withSpring(1, {damping: 6, stiffness: 150}),
    );
    setCurrentWeather(weather);
    onWeatherChange?.(weather);
  };

  const animatedWeatherIcon = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <View style={styles.container}>
      {/* Weather Scene Stage */}
      <View
        style={[
          styles.weatherStage,
          {backgroundColor: currentWeather.bgGradient},
        ]}>
        <Animated.View style={[styles.mainWeatherIcon, animatedWeatherIcon]}>
          <Text style={styles.mainEmoji}>{currentWeather.emoji}</Text>
        </Animated.View>
        <Text style={styles.weatherTitle}>
          {t(currentWeather.nameKey, currentWeather.id)}
        </Text>
        <Text style={styles.weatherDesc}>{t(currentWeather.descKey, '')}</Text>

        <View style={styles.tipsRow}>
          <View style={styles.tipPill}>
            <Text style={styles.tipPillText}>
              👕 {t(currentWeather.clothesKey, '')}
            </Text>
          </View>
          <View style={styles.tipPill}>
            <Text style={styles.tipPillText}>
              ⚽ {t(currentWeather.activityKey, '')}
            </Text>
          </View>
        </View>
      </View>

      {/* Weather Selection Controls */}
      <Text style={styles.prompt}>
        {t('science.weather.prompt', 'Change the weather by tapping below:')}
      </Text>

      <View style={styles.weatherButtonsRow}>
        {WEATHER_TYPES.map(w => {
          const isSelected = w.id === currentWeather.id;
          return (
            <Pressable
              key={w.id}
              accessibilityRole="button"
              onPress={() => handleSelectWeather(w)}
              style={[
                styles.weatherBtn,
                isSelected && styles.activeWeatherBtn,
              ]}>
              <Text style={styles.weatherBtnEmoji}>{w.emoji}</Text>
              <Text
                style={[
                  styles.weatherBtnLabel,
                  isSelected && styles.activeWeatherBtnLabel,
                ]}>
                {t(w.nameKey, w.id)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 16,
  },
  weatherStage: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    shadowColor: '#0EA5E9',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainWeatherIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF80',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  mainEmoji: {
    fontSize: 54,
  },
  weatherTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  weatherDesc: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginTop: 4,
  },
  tipsRow: {
    gap: 8,
    marginTop: 14,
    width: '100%',
  },
  tipPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
  },
  tipPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  prompt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
    textAlign: 'center',
  },
  weatherButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  weatherBtn: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  activeWeatherBtn: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
    transform: [{scale: 1.05}],
  },
  weatherBtnEmoji: {
    fontSize: 28,
  },
  weatherBtnLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 4,
  },
  activeWeatherBtnLabel: {
    color: '#0369A1',
    fontWeight: '900',
  },
});
