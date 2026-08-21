import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {MonthsExplorer} from '../../features/time/presentation/components';
import {recordTimeTopicCompletion} from '../../features/time/data/progress/timeProgress';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'MonthsLesson'>;

export function MonthsLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleGameComplete = useCallback(
    (stars: number) => {
      recordTimeTopicCompletion('months', stars);
      navigation.navigate('TimeComplete', {
        starsEarned: stars,
        topicTitle: t('time.topics.months.title', 'Months of the Year'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F5F3FF">
      <LearningHeader
        title={t('time.topics.months.title', 'Months of the Year')}
        subtitle="12 Months & Seasons"
        emoji="📆"
        accentColor="#7C3AED"
        titleColor="#7C3AED"
      />
      <MonthsExplorer onComplete={handleGameComplete} />
    </AppSafeAreaView>
  );
}
