import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView, LearningHeader} from '@components';
import {DaysSequenceGame} from '../../features/time/presentation/components';
import {recordTimeTopicCompletion} from '../../features/time/data/progress/timeProgress';
import type {TimeStackParamList} from '../../navigation/timeTypes';

type Nav = NativeStackNavigationProp<TimeStackParamList, 'DaysLesson'>;

export function DaysLessonScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleGameComplete = useCallback(
    (stars: number) => {
      recordTimeTopicCompletion('days', stars);
      navigation.navigate('TimeComplete', {
        starsEarned: stars,
        topicTitle: t('time.topics.days.title', 'Days of the Week'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFDF5">
      <LearningHeader
        title={t('time.topics.days.title', 'Days of the Week')}
        subtitle="7 Days & Yesterday / Tomorrow"
        emoji="📅"
        accentColor="#059669"
        titleColor="#059669"
      />
      <DaysSequenceGame onComplete={handleGameComplete} />
    </AppSafeAreaView>
  );
}
