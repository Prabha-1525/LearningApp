import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {InstructionsLesson} from '../../features/coding/presentation/components';
import {recordCodingTopicCompletion} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<
  CodingStackParamList,
  'InstructionsLesson'
>;

export function InstructionsLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordCodingTopicCompletion('instructions', stars);
      navigation.navigate('CodingComplete', {
        starsEarned: stars,
        topicTitle: t('coding.topics.instructions.title', 'Give Instructions'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FAF5FF">
      <LearningHeader
        title={t('coding.topics.instructions.title', 'Give Instructions')}
        subtitle="Up, Down, Left, Right & Directions"
        emoji="➡️"
        accentColor="#7C3AED"
        titleColor="#7C3AED"
      />
      <InstructionsLesson onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
