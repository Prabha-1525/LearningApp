import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {GuessSoundGame} from '../../features/rhymes/presentation/components';
import {
  recordMusicTopicCompletion,
  recordSoundGuessCorrect,
} from '../../features/rhymes/data/progress/musicProgress';
import type {RhymesStackParamList} from '../../navigation/rhymesTypes';

type Nav = NativeStackNavigationProp<RhymesStackParamList, 'GuessSound'>;

export function GuessSoundScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleCorrectGuess = useCallback(() => {
    recordSoundGuessCorrect();
  }, []);

  const handleComplete = useCallback(
    (stars: number) => {
      recordMusicTopicCompletion('guessSound', stars);
      navigation.navigate('MusicComplete', {
        starsEarned: stars,
        topicTitle: t('rhymes.topics.guessSound.title', 'Guess the Sound'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FAF5FF">
      <LearningHeader
        title={t('rhymes.topics.guessSound.title', 'Guess the Sound')}
        subtitle="Ear Training & Identification"
        emoji="👂"
        accentColor="#7C3AED"
        titleColor="#7C3AED"
      />
      <GuessSoundGame
        onCorrectGuess={handleCorrectGuess}
        onComplete={handleComplete}
      />
    </AppSafeAreaView>
  );
}
