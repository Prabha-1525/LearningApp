import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  HealthyHabitsGame,
  LifeSkillsHeader,
} from '../../features/lifeSkills/presentation/components';
import {recordLifeSkillsTopicCompletion} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'HealthyHabits'>;

export function HealthyHabitsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleComplete = useCallback(
    (stars: number) => {
      recordLifeSkillsTopicCompletion('habits', stars);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned: stars,
        topicTitle: t('lifeSkills.topics.habits.title', 'Healthy Habits'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#ECFDF5">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.habits.title', 'Healthy Habits')}
        subtitle="Food, Water, Rest & Play"
        emoji="🍎"
        accentColor="#059669"
      />
      <HealthyHabitsGame onComplete={handleComplete} />
    </AppSafeAreaView>
  );
}
