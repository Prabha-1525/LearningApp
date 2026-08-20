import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  MusicHeader,
  MusicPatternsGame,
} from '../../features/rhymes/presentation/components';
import {recordMusicTopicCompletion} from '../../features/rhymes/data/progress/musicProgress';
import type {RhymesStackParamList} from '../../navigation/rhymesTypes';

type Nav = NativeStackNavigationProp<RhymesStackParamList, 'MusicPatterns'>;

export function MusicPatternsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordMusicTopicCompletion('patterns', stars);
      navigation.navigate('MusicComplete', {
        starsEarned: stars,
        topicTitle: t('rhymes.topics.patterns.title', 'Musical Patterns'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFDF5">
      <MusicHeader
        title={t('rhymes.topics.patterns.title', 'Musical Patterns')}
        subtitle="Visual & Sound Sequences"
        emoji="🎶"
        accentColor="#059669"
      />
      <MusicPatternsGame onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
