import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {
  HygieneLesson,
  LifeSkillsHeader,
} from '../../features/lifeSkills/presentation/components';
import {
  recordHygieneHabitMastered,
  recordLifeSkillsTopicCompletion,
} from '../../features/lifeSkills/data/progress/lifeSkillsProgress';
import type {LifeSkillsStackParamList} from '../../navigation/lifeSkillsTypes';

type Nav = NativeStackNavigationProp<LifeSkillsStackParamList, 'Hygiene'>;

export function HygieneScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const handleHabitMastered = useCallback((_habitId: string) => {
    recordHygieneHabitMastered();
  }, []);

  const handleComplete = useCallback(
    (stars: number) => {
      recordLifeSkillsTopicCompletion('hygiene', stars);
      navigation.navigate('LifeSkillsComplete', {
        starsEarned: stars,
        topicTitle: t('lifeSkills.topics.hygiene.title', 'Good Hygiene'),
      });
    },
    [navigation, t],
  );

  return (
    <AppSafeAreaView backgroundImage={null} backgroundColor="#F0F9FF">
      <LifeSkillsHeader
        title={t('lifeSkills.topics.hygiene.title', 'Good Hygiene')}
        subtitle="Brush, Wash & Stay Clean"
        emoji="🪥"
        accentColor="#0284C7"
      />
      <HygieneLesson
        onHabitMastered={handleHabitMastered}
        onComplete={handleComplete}
      />
    </AppSafeAreaView>
  );
}
