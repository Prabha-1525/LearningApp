import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {ConditionalsGame} from '../../features/coding/presentation/components';
import {recordCodingTopicCompletion} from '../../features/coding/data/progress/codingProgress';
import type {CodingStackParamList} from '../../navigation/codingTypes';

type Nav = NativeStackNavigationProp<
  CodingStackParamList,
  'ConditionalsLesson'
>;

export function ConditionalsLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordCodingTopicCompletion('conditionals', stars);
      navigation.navigate('CodingComplete', {
        starsEarned: stars,
        topicTitle: t('coding.topics.conditionals.title', 'If / Then Rules'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FDF2F8">
      <LearningHeader
        title={t('coding.topics.conditionals.title', 'If / Then Rules')}
        subtitle="Conditions & Decision Making"
        emoji="❓"
        accentColor="#DB2777"
        titleColor="#DB2777"
      />
      <ConditionalsGame onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
