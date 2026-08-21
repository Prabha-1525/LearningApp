import {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {speakCoachLine} from '@shared/speech/tamilCoachSpeech';
import {useCountries} from '@features/worldExplorer/presentation/hooks/useCountries';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<WorldExplorerStackParamList, 'Capitals'>;

export function CapitalsScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {countries} = useCountries();
  const {progress, learnCapital} = useWorldExplorerProgress();
  const [currentIndex, setCurrentIndex] = useState(0);

  const countriesWithCapitals = countries.filter(c => Boolean(c.capital));
  const currentCountry =
    countriesWithCapitals[
      currentIndex % Math.max(1, countriesWithCapitals.length)
    ];

  const handleNextCapital = () => {
    if (currentCountry) {
      learnCapital(currentCountry.code);
    }
    setCurrentIndex(i => i + 1);
  };

  const handleListen = useCallback(() => {
    if (currentCountry?.capital) {
      const sentence = `The capital of ${currentCountry.name} is ${currentCountry.capital}.`;
      void speakCoachLine(sentence);
    }
  }, [currentCountry]);

  if (!currentCountry) {
    return (
      <AppSafeAreaView testID="capitals-screen">
        <LearningHeader
          title={t('worldExplorer.activities.capitals', {
            defaultValue: 'Capitals',
          })}
          onBack={() => navigation.goBack()}
        />
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView testID="capitals-screen" padded={false}>
      <LearningHeader
        title={t('worldExplorer.activities.capitals', {
          defaultValue: 'Capitals',
        })}
        subtitle={`${currentIndex + 1} / ${countriesWithCapitals.length}`}
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.flagHeader}>
            <Text style={styles.flagEmoji}>{currentCountry.flag}</Text>
          </View>

          <Text style={styles.countryName}>{currentCountry.name}</Text>
          <Text style={styles.continentText}>{currentCountry.continent}</Text>

          <View style={styles.capitalBox}>
            <Text style={styles.capitalLabel}>
              🏛️{' '}
              {t('worldExplorer.labels.capital', {
                defaultValue: 'Capital City',
              })}
            </Text>
            <Text style={styles.capitalValue}>{currentCountry.capital}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleListen}
            style={({pressed}) => [
              styles.listenBtn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.listenIcon}>🔊</Text>
            <Text style={styles.listenText}>கேள் (Listen)</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleNextCapital}
          style={({pressed}) => [
            styles.continueBtn,
            pressed && styles.btnPressed,
          ]}>
          <Text style={styles.continueText}>
            {t('worldExplorer.labels.next', {defaultValue: 'Next Capital ➔'})}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Quiz', {difficulty: 'beginner'})}
          style={({pressed}) => [styles.quizBtn, pressed && styles.btnPressed]}>
          <Text style={styles.quizBtnText}>🎯 Test Capital Quiz</Text>
        </Pressable>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8B5CF6',
    shadowColor: '#5B21B6',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    gap: 10,
  },
  flagHeader: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#DDD6FE',
  },
  flagEmoji: {
    fontSize: 52,
  },
  countryName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  continentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  capitalBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    alignSelf: 'stretch',
    marginVertical: 6,
  },
  capitalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B21A8',
  },
  capitalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#581C87',
    marginTop: 2,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  listenIcon: {
    fontSize: 16,
  },
  listenText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  continueBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quizBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  quizBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
  },
});
