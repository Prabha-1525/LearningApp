import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {InteractiveCalendarView} from '../../features/time/presentation/components';
import {
  recordCalendarExplored,
  recordTimeTopicCompletion,
} from '../../features/time/data/progress/timeProgress';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'CalendarLesson'>;

export function CalendarLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleGameComplete = useCallback(
    (stars: number) => {
      recordCalendarExplored();
      recordTimeTopicCompletion('calendar', stars);
      navigation.navigate('TimeComplete', {
        starsEarned: stars,
        topicTitle: t('time.topics.calendar.title', 'Interactive Calendar'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFEFF">
      <LearningHeader
        title={t('time.topics.calendar.title', 'Interactive Calendar')}
        subtitle="Months, Weeks & Dates"
        emoji="🗓️"
        accentColor="#0891B2"
        titleColor="#0891B2"
      />
      <InteractiveCalendarView onGameComplete={handleGameComplete} />
    </AppSafeAreaView>
  );
}
