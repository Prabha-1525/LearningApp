import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  MusicHeader,
  RhythmTapGame,
} from '../../features/rhymes/presentation/components';
import {
  recordMusicTopicCompletion,
  recordRhythmLevelCompleted,
} from '../../features/rhymes/data/progress/musicProgress';
import type {RhymesStackParamList} from '../../navigation/rhymesTypes';

type Nav = NativeStackNavigationProp<RhymesStackParamList, 'RhythmGame'>;

export function RhythmGameScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleLevelComplete = useCallback(
    (levelNum: number, stars: number) => {
      recordRhythmLevelCompleted(levelNum, stars);
      recordMusicTopicCompletion('rhythm', stars);
      if (levelNum === 6) {
        navigation.navigate('MusicComplete', {
          starsEarned: stars,
          topicTitle: t('rhymes.topics.rhythm.title', 'Rhythm Beat Game'),
        });
      }
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FEF2F2">
      <MusicHeader
        title={t('rhymes.topics.rhythm.title', 'Rhythm Game')}
        subtitle="Tap to the Beat"
        emoji="🥁"
        accentColor="#DC2626"
      />
      <RhythmTapGame onLevelComplete={handleLevelComplete} />
    </AppSafeAreaView>
  );
}
