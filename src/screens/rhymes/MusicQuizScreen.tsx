import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {MusicQuizArena} from '../../features/rhymes/presentation/components';
import {recordMusicTopicCompletion} from '../../features/rhymes/data/progress/musicProgress';
import type {RhymesStackParamList} from '../../navigation/rhymesTypes';

type Nav = NativeStackNavigationProp<RhymesStackParamList, 'MusicQuiz'>;

export function MusicQuizScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleFinish = useCallback(
    (score: number) => {
      const starsEarned = score >= 8 ? 3 : score >= 5 ? 2 : 1;
      recordMusicTopicCompletion('quiz', starsEarned);
      navigation.navigate('MusicComplete', {
        starsEarned,
        topicTitle: t('rhymes.topics.quiz.title', 'Music Quiz Arena'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FDF2F8">
      <LearningHeader
        title={t('rhymes.topics.quiz.title', 'Music Quiz Arena')}
        subtitle="10 Fun Musical Questions"
        emoji="🎯"
        accentColor="#DB2777"
        titleColor="#DB2777"
      />
      <MusicQuizArena onFinish={handleFinish} />
    </AppSafeAreaView>
  );
}
