import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  CodingHeader,
  SequencingGame,
} from '../../features/coding/presentation/components';
import {
  recordCodingTopicCompletion,
  recordSequencingSolved,
} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'SequencingLesson'>;

export function SequencingLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordCodingTopicCompletion('sequencing', stars);
      recordSequencingSolved();
      navigation.navigate('CodingComplete', {
        starsEarned: stars,
        topicTitle: t('coding.topics.sequencing.title', 'Arrange Steps'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFDF5">
      <CodingHeader
        title={t('coding.topics.sequencing.title', 'Arrange Steps')}
        subtitle="Logical 1 ➔ 2 ➔ 3 ➔ 4 Order"
        emoji="🔢"
        accentColor="#059669"
      />
      <SequencingGame onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
