import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  InstrumentsExplorer,
  MusicHeader,
} from '../../features/rhymes/presentation/components';
import {
  recordInstrumentExplored,
  recordMusicTopicCompletion,
} from '../../features/rhymes/data/progress/musicProgress';
import type {RhymesStackParamList} from '../../navigation/rhymesTypes';

type Nav = NativeStackNavigationProp<RhymesStackParamList, 'Instruments'>;

export function InstrumentsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleExplore = useCallback((_instId: string) => {
    recordInstrumentExplored();
  }, []);

  const handleComplete = useCallback(
    (stars: number) => {
      recordMusicTopicCompletion('instruments', stars);
      navigation.navigate('MusicComplete', {
        starsEarned: stars,
        topicTitle: t('rhymes.topics.instruments.title', 'Musical Instruments'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#EFF6FF">
      <MusicHeader
        title={t('rhymes.topics.instruments.title', 'Musical Instruments')}
        subtitle="Explore 6 Instruments & Sounds"
        emoji="🎹"
        accentColor="#2563EB"
      />
      <InstrumentsExplorer
        onExploreInstrument={handleExplore}
        onComplete={handleComplete}
      />
    </AppSafeAreaView>
  );
}
