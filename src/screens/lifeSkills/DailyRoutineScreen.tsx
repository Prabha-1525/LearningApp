import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  DailyRoutineGame,
  LifeSkillsHeader,
} from '../../features/lifeSkills/presentation/components';
import {
  recordLifeSkillsTopicCompletion,
  recordRoutineSequenced,
} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'DailyRoutine'>;

export function DailyRoutineScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleSequenced = useCallback(() => {
    recordRoutineSequenced();
  }, []);

  const handleComplete = useCallback(
    (stars: number) => {
      recordLifeSkillsTopicCompletion('routine', stars);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned: stars,
        topicTitle: t('lifeSkills.topics.routine.title', 'Daily Routine'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#FFFBEB">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.routine.title', 'Daily Routine')}
        subtitle="Morning Steps to School"
        emoji="🛏️"
        accentColor="#D97706"
      />
      <DailyRoutineGame
        onRoutineSequenced={handleSequenced}
        onComplete={handleComplete}
      />
    </AppSafeAreaView>
  );
}
