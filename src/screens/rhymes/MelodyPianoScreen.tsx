import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  MelodyPianoGame,
  MusicHeader,
} from '../../features/rhymes/presentation/components';
import {recordMusicTopicCompletion} from '../../features/rhymes/data/progress/musicProgress';
import type {RhymesStackParamList} from '../../navigation/rhymesTypes';

type Nav = NativeStackNavigationProp<RhymesStackParamList, 'MelodyPiano'>;

export function MelodyPianoScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleCompleteSong = useCallback(() => {
    recordMusicTopicCompletion('piano', 3);
    navigation.navigate('MusicComplete', {
      starsEarned: 3,
      topicTitle: t('rhymes.topics.piano.title', 'Do-Re-Mi Piano'),
    });
  }, [navigation, t]);

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <MusicHeader
        title={t('rhymes.topics.piano.title', 'Do-Re-Mi Piano')}
        subtitle="Rainbow Keyboard & Melodies"
        emoji="🎼"
        accentColor="#D97706"
      />
      <MelodyPianoGame onCompleteSong={handleCompleteSong} />
    </AppSafeAreaView>
  );
}
