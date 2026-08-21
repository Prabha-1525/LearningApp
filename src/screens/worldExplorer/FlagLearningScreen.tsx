import {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {speakCoachLine} from '@shared/speech/tamilCoachSpeech';
import {FlagCard} from '@features/worldExplorer/presentation/components';
import {useCountries} from '@features/worldExplorer/presentation/hooks/useCountries';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<
  WorldExplorerStackParamList,
  'FlagLearning'
>;

export function FlagLearningScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {countries} = useCountries();
  const {progress, learnFlag} = useWorldExplorerProgress();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCountry = countries[currentIndex];

  const handleNextFlag = () => {
    if (currentCountry) {
      learnFlag(currentCountry.code);
    }
    if (currentIndex < countries.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleListen = useCallback(() => {
    if (currentCountry) {
      const sentence = `${currentCountry.name} is located in ${currentCountry.continent}.`;
      void speakCoachLine(sentence);
    }
  }, [currentCountry]);

  if (!currentCountry) {
    return (
      <AppSafeAreaView testID="flag-learning-screen">
        <LearningHeader
          title={t('worldExplorer.activities.flags', {defaultValue: 'Flags'})}
          onBack={() => navigation.goBack()}
        />
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView testID="flag-learning-screen" padded={false}>
      <LearningHeader
        title={t('worldExplorer.activities.flags', {defaultValue: 'Flags'})}
        subtitle={`${currentIndex + 1} / ${countries.length}`}
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <FlagCard
          flagEmoji={currentCountry.flag}
          countryName={currentCountry.name}
          continentName={currentCountry.continent}
          descriptionText={
            currentCountry.funFact ??
            `${currentCountry.name} is a wonderful country in ${currentCountry.continent}!`
          }
          onListen={handleListen}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleNextFlag}
          style={({pressed}) => [
            styles.continueBtn,
            pressed && styles.btnPressed,
          ]}>
          <Text style={styles.continueText}>
            {t('worldExplorer.labels.next', {defaultValue: 'Next Flag ➔'})}
          </Text>
        </Pressable>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    gap: 16,
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
    marginHorizontal: 16,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  continueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
