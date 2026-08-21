import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {DebuggingGame} from '../../features/coding/presentation/components';
import {
  recordCodingTopicCompletion,
  recordDebuggingSolved,
} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<CodingStackParamList, 'DebuggingLesson'>;

export function DebuggingLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordCodingTopicCompletion('debugging', stars);
      recordDebuggingSolved();
      navigation.navigate('CodingComplete', {
        starsEarned: stars,
        topicTitle: t('coding.topics.debugging.title', 'Fix the Bug'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FEF2F2">
      <LearningHeader
        title={t('coding.topics.debugging.title', 'Fix the Bug')}
        subtitle="Find Mistakes & Correct Code"
        emoji="🐛"
        accentColor="#DC2626"
        titleColor="#DC2626"
      />
      <DebuggingGame onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
